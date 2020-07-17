//validators
const auth = require('../validators/auth');

//utils -> errors
const { BadRequestError, NotFoundError } = require('../utils/errorHandler');

//utils
const { isEmailTaken, hashPassword, isThePasswordCorrect } = require('../utils/user');
const { createJwt } = require('../utils/jwt');
const { rsp, rspError, validateAndFilterData } = require('../utils/general');


//Models
const User = require('../models/user');



exports.signUp = (req, res) => {
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

        req.on('end', () => { processSignUp(req, res, body) });


}

const processSignUp = async (req, res, body) => {

    try {

        const { email, password } = validateAndFilterData(body, auth.signUp);
        
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

}

exports.signIn = (req, res) => {

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

        req.on('end', () => { processSignIn(req, res, body) });

}

const processSignIn = async (req, res, body) => {
            
    try {

        const { email, password } = validateAndFilterData(body, auth.signIn);

        const user = new User();
        const userExists = await user.getOne({ "email": email });    
        if (!userExists) throw new NotFoundError('That email has not been registered.'); 

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

}




