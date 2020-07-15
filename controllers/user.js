//https://stackoverflow.com/questions/31978347/fs-writefile-in-a-promise-asynchronous-synchronous-stuff
//https://stackoverflow.com/a/52094177
//core modules
const fs = require('fs');
const path = require('path');

//3rd party modules
const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectID;

//utils
const { rsp, rspError } = require('../utils/general');
const { get } = require('../utils/db'); 
const { decodeJwt } = require('../utils/jwt'); 
const { NotFoundError } = require('../utils/errorHandler');

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
