const { authController, processSignIn, processSignUp } = require('../controllers/auth');

const auth = (req, res) => {
    const finalUrlSegment = req.url.split('/')[4];

    //console.log(finalUrlSegment)

    if (finalUrlSegment === 'signup'){
        authController(req, res, processSignUp);
    } else if (finalUrlSegment === 'signin'){
        authController(req, res, processSignIn);
    }
}

module.exports = auth;
