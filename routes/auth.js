const {signUp, signIn} = require('../controllers/auth');

const auth = (req, res) => {
    const finalUrlSegment = req.url.split('/')[4];

    //console.log(finalUrlSegment)

    if (finalUrlSegment === 'signup'){
        signUp(req, res);
    } else if (finalUrlSegment === 'signin'){
        signIn(req, res);
    }
}

module.exports = auth;
