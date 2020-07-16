const { uploadImage, searchUser, getOne } = require('../controllers/user');

const user = (req, res) => {
    const finalUrlSegment = req.url.split('/')[4];

    //console.log(finalUrlSegment)

    if (finalUrlSegment === 'profile-img'){
        
        uploadImage(req, res);
        
    } else if (finalUrlSegment === 'search'){ 
        
        searchUser(req, res);
    
    } else if (req.url.includes("?") && req.method === 'GET'){
    
        getOne(req, res);    
    
    }
    
    
}

module.exports = user;
