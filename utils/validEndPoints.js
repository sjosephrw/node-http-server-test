const url = require('url');
const querystring = require('querystring');

//GET only endpoints
const getMethodEndPoints = ['/', '/api/v1/product', '/api/v1/user'];

//POST only endpoints
const postMethodEndPoints = ['/api/v1/auth/signup', '/api/v1/auth/signin', '/api/v1/product', '/api/v1/user',  '/api/v1/user/profile-img'];

//[GET, PATCH, DELETE] end points with query parameters '?id=123', 
const getPatchDeleteEndPoints = [
    '/api/v1/product', '/api/v1/user'
]


const isEmpty = (obj) => {
    if (typeof obj === 'object'){
        return Object.keys(obj).length === 0 ? true : false;
    } else {
        return false;
    }

}

const hasKeyWithValue = (obj) => {

    //DON'T use hasOwnProperty here, becuase the prototype is null it throws an error just use if(obj['id'])
    /*
    [Object: null prototype] { id: '3' }
    UNCAUGHT EXCEPTION! 💥 Shutting down...
    TypeError obj.hasOwnProperty is not a function    
    
    */ 

    if (obj['id']){
        //console.log('validEndPoints, hasKeyWithValue() -> ', obj['id']);
        return true;
    } else {
        return false;
    }
}

const validateEndPoints = (req) => {
    const parsed = url.parse(req.url);
    
    const query  = querystring.parse(parsed.query);
    
    //console.log(query);
    
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
                } else if (req.url.startsWith('/uploads')){//static directory - images    
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
