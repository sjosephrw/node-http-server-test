//utils
const validateEndPoints = require('./utils/validEndPoints');
const { rsp } = require('./utils/general');

//routes
const auth = require('./routes/auth');

const functionHandler = function (req, res) {

    if (!validateEndPoints(req)){

      //curl http://127.0.0.1:3000/invalid    
      
      rsp(res, 404, {'status': 'fail', 'message': 'Sorry! The requested URL was not found on this server. 💥'});
      
    } else if (req.url === '/'){

      //curl http://127.0.0.1:3000
      //curl -X POST http://127.0.0.1:3000 -> invalid 404 error
      
      rsp(res, 200, {'status': 'success', 'message': 'Welcome to the API v1 🌛', 'app': 'Node http server.'});      
      
    } else if (req.url.startsWith('/api/v1/auth/')){
    
        auth(req, res);
    
    } else if (req.url.startsWith('/api/v1/product')){
      
      //https://stackoverflow.com/questions/13371284/curl-command-line-url-parameters
      //curl -X GET 'http://127.0.0.1:3000/api/v1/product?id=3'
      //curl -X DELETE 'http://127.0.0.1:3000/api/v1/product?id=3'

      rsp(res, 200, {'status': 'success', 'message': 'This route has not been completed yet.  🏈'});            
      
    }  

};

module.exports = functionHandler;
