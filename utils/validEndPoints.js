const url = require('url');
const querystring = require('querystring');

//GET only endpoints
const getMethodEndPoints = ['/', '/api/v1/product'];

//POST only endpoints
const postMethodEndPoints = ['/api/v1/auth/signup', '/api/v1/auth/signin', '/api/v1/product'];

//[GET, PATCH, DELETE] end points with query parameters '?id=123', 
const getPatchDeleteEndPoints = [
    '/api/v1/product'
]


const isEmpty = (obj) => {
    if (typeof obj === 'object'){
        return Object.keys(obj).length === 0 ? true : false;
    } else {
        return false;
    }

}

const hasKeyWithValue = (obj) => {
    if (obj.hasOwnProperty('id')){
        if (obj[id]){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const validateEndPoints = (req) => {
    const parsed = url.parse(req.url);
    
    const query  = querystring.parse(parsed.query);
    
    if (!isEmpty(query) && hasKeyWithValue(query)){
        
        if (req.method === 'GET' || req.method === 'PATCH' || req.method === 'DELETE'){
                
            const endPoint = req.url.split('?')[0];

            if (getPatchDeleteEndPoints.includes(endPoint)){
                return true;
            } else {
                return false;
            } 
      
      } else {
        return false;
      }     
    
    } else if (req.method === 'GET' || req.method === 'POST') {
    
            if (req.method === 'GET'){
            
                if (getMethodEndPoints.includes(req.url)){
                    return true;
                } else {
                    return false;
                } 
            
            } else {
            
                if (postMethodEndPoints.includes(req.url)){
                    return true;
                } else {
                    return false;
                }             
             
            }     
    
    }

}   

module.exports = validateEndPoints;
