//validators
const auth = require('../validators/auth');

//utils -> errors
const { BadRequestError, NotFoundError } = require('../utils/errorHandler');

//utils
const { isEmailTaken, hashPassword, isThePasswordCorrect } = require('../utils/user');
const { createJwt } = require('../utils/jwt');
const { rsp, rspError, validateAndFilterData, parseJSON } = require('../utils/general');


//Models
const User = require('../models/user');



exports.authController = (req, res, cb) => {

  parseJSON(req, res, cb);

}

exports.processSignUp = async (req, res, body) => {

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



exports.processSignIn = async (req, res, body) => {

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
