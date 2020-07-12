//validators
const auth = require('../validators/auth');

//utils -> errors
const { BadRequestError } = require('../utils/errorHandler');

//utils
const { isEmailTaken, hashPassword, isThePasswordCorrect } = require('../utils/user');
const { createJwt } = require('../utils/jwt');
const { rsp, rspError } = require('../utils/general');

//Models
const User = require('../models/user');



exports.signUp = (req, res) => {
    //https://stackoverflow.com/questions/35704617/node-js-http-server-error-handling
    //https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js

    //https://gist.github.com/subfuzion/08c5d85437d5d4f00e58
    //curl -d '{"email":"joseph@example.com", "password":"test1234"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signup 
    //curl -d '{"email":"michael@example.com", "password":"test1234"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signup 
        
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
                //validate the sign up data
                auth.signUp(data, res);
               
                const { email, password } = data;
               
                const emailExists = await isEmailTaken(email);
                if (emailExists) throw new BadRequestError('That Email has been taken.');    
                
                const hashedPassword = await hashPassword(password);
                
                const user = new User();
                const doc = await user.createOne({ "email": email, "password": hashedPassword });
              
                const userObj = {
                    _id: doc._id,
                    email: doc.email
                }
                            
                rsp(res, 201, {'status': 'success', 'message': 'Success! you have been signed up. 🙂', 'data': {'data': userObj}});            
                            
            } catch (e){
                console.log(e);
                rspError(res, e);
            }

        });


}

exports.signIn = (req, res) => {

    //https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
    //curl -d '{"email":"test@example.com", "password":"test1234"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signin
    //https://gist.github.com/subfuzion/08c5d85437d5d4f00e58

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

                console.log(body);
                //receive form data
                //to prevent curl response with no data from crashing the server -> curl -X POST http://127.0.0.1:3000/api/v1/auth/signup
                
                if (!body){
                    throw new BadRequestError('Invalid request!');
                }
                
                const data = JSON.parse(body);
                
                //validate the sign in data
                auth.signIn(data, res);
                
                const { email, password } = data;
               
                const user = new User();
                const userExists = await user.getOne({ "email": email });    
                if (!userExists) throw new BadRequestError('That email has not been registered.'); 
              
                const result = await isThePasswordCorrect(password, userExists.password);
                if (!result) throw new BadRequestError('Invalid Email or Password.');
              
                const userObj = {
                    _id: userExists._id,
                    email: userExists.email,
                    role: userExists.role
                }
              
                const token = createJwt(userObj);
                
                rsp(res, 200, {'status': 'success', 'message': 'Success! signed in, redirecting in 3 seconds. 🏀', 'token': token, 'data': {'data':userObj}});                            
                
              } catch (e){
                console.log(e);
                rspError(res, e);
              }            

        });

}
