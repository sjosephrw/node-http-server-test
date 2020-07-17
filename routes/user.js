const { uploadImage, searchUser, getAll, getOne, updateOne, deleteOne } = require('../controllers/user');

const user = (req, res) => {

    const finalUrlSegment = req.url.split('/')[4];

    //console.log(finalUrlSegment)

    if (finalUrlSegment === 'profile-img'){
        
        uploadImage(req, res);
        
    } else if (finalUrlSegment === 'search'){ 
        
        searchUser(req, res);
    
    } else if (req.url.includes("?") && req.method === 'GET'){
    
        getOne(req, res);    
    
    } else if (req.url.includes("?") && req.method === 'PATCH'){
    
        updateOne(req, res);    
    
    } else if (req.url.includes("?") && req.method === 'DELETE'){
    
        deleteOne(req, res);    
    
    } else if (!req.url.includes("?") && req.method === 'GET'){
    
        getAll(req, res);    
    
    }
    
    
}

module.exports = user;
