const fs = require('fs');

//utils
const validateEndPoints = require('./utils/validEndPoints');
const { rsp } = require('./utils/general');

//routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const document = require('./routes/document');

const functionHandler = function (req, res) {

    if (!validateEndPoints(req)){

        //curl http://127.0.0.1:3000/invalid    
      
        rsp(res, 404, {'status': 'fail', 'message': 'Sorry! The requested URL was not found on this server. 💥'});
      
    } else if (req.url === '/'){

        //curl http://127.0.0.1:3000
        //curl -X POST http://127.0.0.1:3000 -> invalid 404 error
      
        rsp(res, 200, {'status': 'success', 'message': 'Welcome to the API v1 🌛', 'app': 'Node http server.'});      
      
    } else if (req.url.startsWith('/uploads')){
    
    //http://127.0.0.1:3000/uploads/<imageName>
    
    const img = req.url.split('/')[2];

    //console.log(img, __dirname + `/uploads/` + img)
    
        fs.readFile(__dirname + `/uploads/` + img, function(err, data) {
            if(err) {
                res.writeHead(500, { 'Content-Type' : 'text/plain' });
                res.end('500 - Internal Error');
            } 
            else {
                res.writeHead( 200, { 'Content-Type' : 'image/jpeg' });
                res.end(data);
            }
        });        
        
      
    } else if (req.url.startsWith('/api/v1/auth/')){
    
        //curl -d '{"email":"test@example.com", "password":"password"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signup
        //curl -d '{"email":"test@example.com", "password":"password"}' -H "Content-Type: application/json" -X POST http://127.0.0.1:3000/api/v1/auth/signin
    
        auth(req, res);
        
    } else if (req.url.startsWith('/api/v1/user')){    
        //Get One User -> curl -X GET 'http://127.0.0.1:3000/api/v1/user?id=<userId>'
        //Upload User Image -> http://127.0.0.1:3000/api/v1/user/profile-img -> set JWT in header and <input type="file" name="filetoupload"> set the name attribute value to 'filetoupload'
        user(req, res);
    
    }  else if (req.url.startsWith('/api/v1/document')){
      
        //https://stackoverflow.com/questions/13371284/curl-command-line-url-parameters
        //curl -X GET 'http://127.0.0.1:3000/api/v1/product?id=3'
        //curl -X DELETE 'http://127.0.0.1:3000/api/v1/product?id=3'

        document(req, res);

        rsp(res, 200, {'status': 'success', 'message': 'This route has not been completed yet.  🏈'});            
      
    }  

};

module.exports = functionHandler;
