//https://stackoverflow.com/questions/31978347/fs-writefile-in-a-promise-asynchronous-synchronous-stuff
//https://stackoverflow.com/a/52094177
//core modules
const fs = require('fs');
const path = require('path');

//3rd party modules
const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectID;
const sanitize = require('mongo-sanitize');

//validators
const userValidator = require('../validators/user');

//utils
const { rsp, rspError, validateAndFilterData, getAndSanitizeReqParamsId } = require('../utils/general');
const { get } = require('../utils/db'); 
const { decodeJwt } = require('../utils/jwt'); 
const { NotFoundError, BadRequestError, NotAuthorizedError } = require('../utils/errorHandler');
const { xssFilter } = require('../utils/security');
const { isEmailTaken, hashPassword } = require('../utils/user');


//models
const User = require('../models/user');

exports.uploadImage = async (req, res) => {

    try {
    
        const user = new User();
    
        const userObj = await decodeJwt(req);
    
        const userExists = await user.getOne({ '_id': ObjectId(userObj._id) });
    
        if (!userExists) throw new NotFoundError('User not found!');
    
        const form = new formidable.IncomingForm();

        form.parse(req, async function (err, fields, files) {

            if (err) throw err;
            //console.log('uploadImage ->', files)

            if (!files.filetoupload) throw 'Set <input type="file" name="filetoupload"> set the name attribute value to "filetoupload"';


            const oldpath = files.filetoupload.path;
            const userIdAndImageName = userExists._id + '-' + files.filetoupload.name;
            const newpath = path.resolve(__dirname, '../uploads') + '/' + userIdAndImageName

            //console.log(newpath);
            
            const dbPath = '/uploads' + '/' + userIdAndImageName;
              
            fs.rename(oldpath, newpath, async function (err2) {
                
                if (err2) throw err2;
                
                const myquery = { _id: ObjectId(userExists._id) };
                const newvalues = { $set: { image: dbPath } };

                const doc = await user.updateOne(myquery, newvalues);               

                    
                const responseObj = {
                    'status': 'success',
                    'message': 'Image uploaded successfully 🌳',
                    'data':  { 'data': doc }
                }                    
            
                rsp(res, 200, responseObj)

            
            });  
        
        });    
    
    } catch (e){
        console.log(e);
        rspError(res, e)    
    }

}


exports.searchUser = (req, res) => {

        //https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js

        let body = '';

        req.on('error', (err) => {
          // This prints the error message and stack trace to `stderr`.
          console.error(err.stack);
        });

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', () => { processSearchData(req, res, body) });

}

const processSearchData = async (req, res, body) => {

    try {

        const { query, page, limit } = validateAndFilterData(body, userValidator.searchUserValidate);                
        
        //without these lines MongoError: limit requires an integer
        const intPage = parseInt(page, 10);
        const intLimit = parseInt(limit, 10);
        
        const user = new User();
        
        const doc = await user.searchUser(query, intPage, intLimit);
        
        const responseObj = {
            'status': 'success',
            'message': 'Search results! 🔍️',
            'data':  { 'data': doc }
        }                    

        rsp(res, 200, responseObj)               
        
    } catch(e){
        console.log(e);
        rspError(res, e)              
    }
        
}

exports.getAll = async (req, res) => {

    try {
        
        const user = new User();
        const users = await user.getAll();  
        
        const responseObj = {
            'status': 'success',
            'message': 'User results! 👦️',
            'data':  { 'data': users }
        }                    

        rsp(res, 200, responseObj)
        
    } catch (e){
        console.log(e);
        rspError(res, e)     
    }
        
}

exports.getOne = async (req, res) => {

    try {
 
        const id = getAndSanitizeReqParamsId(req);
        
        const user = new User();
        const userExists = await user.getOne({ '_id': ObjectId(id) });  
             
        if (!userExists) throw new NotFoundError('User not found!');
        
        
                const responseObj = {
                    'status': 'success',
                    'data':  { 'data': userExists }
                }                    

                rsp(res, 200, responseObj)
        
   
    
    } catch (e){
        console.log(e);
        rspError(res, e)     
    }
        
}

exports.updateOne = (req, res) => {
    //https://stackoverflow.com/questions/35704617/node-js-http-server-error-handling
    //https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
        
        let body = '';

        req.on('error', (err) => {
          // This prints the error message and stack trace to `stderr`.
          console.error(err.stack);
        });

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', () => { processModifyUserData(req, res, body) });

}

const processModifyUserData = async (req, res, body) => {

    try {
    
        const id = getAndSanitizeReqParamsId(req);

        const { email, password } = validateAndFilterData(body, userValidator.modifyUser);
        
        const user = new User();
    
        const userObj = await decodeJwt(req);
    
        if (id !== userObj._id) throw new NotAuthorizedError('You are not authorized to perform this action!');
    
        const userExists = await user.getOne({ '_id': ObjectId(id) });
    
        if (!userExists) throw new NotFoundError('User not found!');                
       
        const emailExists = await isEmailTaken(email);
        if (emailExists) throw new BadRequestError('That Email has been taken.');    
        
        const hashedPassword = await hashPassword(password);
        
        const doc = await user.updateOne({ '_id': ObjectId(id) }, { $set: { "email": email, "password": hashedPassword } });
      
        const userRspObj = {
            _id: doc._id,
            email: doc.email
        }
                    
        rsp(res, 200, {'status': 'success', 'message': 'Success! user data modified. 👍️', 'data': {'data': userRspObj}});            
                    
    } catch (e){
        console.log(e);
        rspError(res, e);
    }  

}

exports.deleteOne = async (req, res) => {

    try {

        const id = getAndSanitizeReqParamsId(req);
        
        const userObj = await decodeJwt(req);
        
        if (id !== userObj._id) throw new NotAuthorizedError('You are not authorized to perform this action!');
        
        const user = new User();
        const userExists = await user.getOne({ '_id': ObjectId(id) });  
             
        if (!userExists) throw new NotFoundError('User not found!');
        
        await user.deleteOne({ '_id': ObjectId(id) });
        
        const responseObj = {
            'status': 'success',
            'data': null
        }                    

        rsp(res, 204, responseObj)
        
    } catch (e){
        console.log(e);
        rspError(res, e)     
    }
        
}


