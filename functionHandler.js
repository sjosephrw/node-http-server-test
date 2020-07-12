const validateEndPoints = require('./utils/validEndPoints');
const auth = require('./routes/auth');

const functionHandler = function (req, res) {

    if (!validateEndPoints(req)){

      //curl http://127.0.0.1:3000/invalid    
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({'status': 'fail', 'message': 'Sorry! The requested URL was not found on this server. 💥'}));         
      res.end();
    } else if (req.url === '/'){

      //curl http://127.0.0.1:3000
      //curl -X POST http://127.0.0.1:3000 -> invalid 404 error
      res.writeHead(200, {'Content-Type': 'application/json'});
      //res.write('Hello World!');
      res.write(JSON.stringify({'status': 'success', 'message': 'Welcome to the API v1 🌛', 'app': 'Node http server.'}));  
      res.end();
    } else if (req.url.startsWith('/api/v1/auth/')){
    
        auth(req, res);
    
    } else if (req.url.startsWith('/api/v1/product')){
    
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify({'status': 'success', 'message': 'This route has not been completed yet.  🏈'}));
      res.end();
    }  

};

module.exports = functionHandler;
