const jwt = require('jsonwebtoken');

//error handler
const { BadRequestError } = require('./errorHandler');

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiryTime = { expiresIn: process.env.JWT_EXPIRY_TIME };

exports.createJwt = (data) => {
    const token = jwt.sign(data, jwtSecret, jwtExpiryTime);
    return token;
};

exports.decodeJwt = async (req) => {
    let authHeader = req.headers['authorization'];
    
    if (!authHeader){
        throw new BadRequestError('No Authorization header!');    
    }
    
    //console.log(req.headers);
    //console.log(authHeader);
    
    let token = authHeader.split(' ')[1];
    if (token) {
        // verify a token symmetric
        const userObj = jwt.verify(token, jwtSecret);
        //console.log(userObj);
        return userObj;    
    } else {
        throw new BadRequestError('JWT not present in Authorization header!');
    }
} 

