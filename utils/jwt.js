const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiryTime = { expiresIn: process.env.JWT_EXPIRY_TIME };

exports.createJwt = (data) => {
    const token = jwt.sign(data, jwtSecret, jwtExpiryTime);
    return token;
};

