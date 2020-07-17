//const { createOne } = require('../controllers/document');

const document = (req, res) => {

    const finalUrlSegment = req.url.split('/')[4];

    //console.log(finalUrlSegment)

    if (finalUrlSegment === 'search'){ 
        
        //searchDocument(req, res);
    
    } else if (req.url.includes("?") && req.method === 'GET'){
    
        //getOne(req, res);    
    
    } else if (req.url.includes("?") && req.method === 'PATCH'){
    
        //updateOne(req, res);    
    
    } else if (req.url.includes("?") && req.method === 'DELETE'){
    
        //deleteOne(req, res);    
    
    }
    
    
}

module.exports = document;
