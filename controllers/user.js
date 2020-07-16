//https://stackoverflow.com/questions/31978347/fs-writefile-in-a-promise-asynchronous-synchronous-stuff
//https://stackoverflow.com/a/52094177
//core modules
const fs = require('fs');
const path = require('path');

//3rd party modules
const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectID;
const sanitize = require('mongo-sanitize');


//utils
const { rsp, rspError } = require('../utils/general');
const { get } = require('../utils/db'); 
const { decodeJwt } = require('../utils/jwt'); 
const { NotFoundError } = require('../utils/errorHandler');
const { xssFilter } = require('../utils/security');


//validators
const { searchUser } = require('../validators/user');

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
            const newpath = path.resolve(__dirname, '../uploads') + '/' + userExists._id + files.filetoupload.name;

            //console.log(newpath);
            
            const dbPath = '/uploads' + '/' + userExists._id + files.filetoupload.name;
              
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

exports.getOne = async (req, res) => {

    try {
 
        const id = req.url.split('?')[1].split('=')[1];
        console.log(id); 
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

        req.on('end', async function () {
        
            try {
                
                //receive form data
                //to prevent curl response with no data from crashing the server -> curl -X POST http://127.0.0.1:3000/api/v1/auth/signup
                
                if (!body){
                    throw new BadRequestError('Invalid request!');
                }
                
                const data = JSON.parse(body);
                
                //filter xss                    
                const filteredObj = xssFilter(data);
                
                //prevent NoSQl injectiion
                sanitize(filteredObj);              
                
                //validate data
                searchUser(filteredObj);
                
                const { query, page, limit } = filteredObj;                
                
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
        
        });

}

