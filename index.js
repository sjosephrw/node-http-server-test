//core modules
const http = require('http');

//3rd party modules
const dotenv = require('dotenv');

//require env. variables
//set the env. file up here or else the .utils/db file can not require the env. Variables.
dotenv.config({ path: './config.env' });

//database
const db = require('./utils/db');

//main function handler
const functionHandler = require('./functionHandler');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

//create the server object
const server = http.createServer(functionHandler);

//set server port
const port = process.env.PORT || 5000;

//connect to db
db.connect(() => {
    //start server
    server.listen(port, () => {
        console.log(`Server listening on port ${port} 👋`);
    });
});

process.on('unhandledRejection', function (reason, promise) {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error( `{'reason': ${reason}, 'promise': ${promise} }` );    
    server.close(() => {
        process.exit(1);
    });
});
