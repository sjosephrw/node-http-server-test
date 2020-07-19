const fs = require('fs');

//3rd party modules
const sanitize = require('mongo-sanitize');

const { BadRequestError } = require('./errorHandler');
const { xssFilter } = require('./security');

exports.rspError = (res, e) => {

    let sCode;
    let responseObj = {};

    if (e.statusCode === undefined){

        sCode = 500;

        responseObj = {
          status: 'error',
          msg: 'Sorry for the inconvenience, something went very wrong 💥',
          stack: e.stack
        }

    } else {

        sCode = e.statusCode;

        responseObj = {
          status: e.status,
          msg: e.message,
          stack: e.stack
        }

    }

    res.writeHead(sCode, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(responseObj));
    res.end();
}

exports.rsp = (res, sCode, rspObj) => {
    res.writeHead(sCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PATCH,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
    res.write(JSON.stringify(rspObj));
    res.end();
}

exports.validateAndFilterData = (body, cb) => {

        console.log(body);
        //receive form data
        //to prevent curl response with no data from crashing the server -> curl -X POST http://127.0.0.1:3000/api/v1/auth/signup

        if (!body){
            throw new BadRequestError('Invalid request!');
        }
        const data = JSON.parse(body);

        //filter xss
        const filteredObj = xssFilter(data);
        //console.log(filteredObj);
        //return;

        //prevent NoSQl injectiion
        sanitize(filteredObj);
        //console.log(filteredObj);
        //return;

        //validate the data
        cb(filteredObj);

        return filteredObj;

}

exports.getAndSanitizeReqParamsId = (req) => {

    const id = req.url.split('?')[1].split('=')[1];
    console.log(`utils/user ->`, id);
    sanitize(id);
    return id;

}

exports.parseJSON = (req, res, cb) => {
  //https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js

  let body = '';

  req.on('error', (err) => {
    // This prints the error message and stack trace to `stderr`.
    console.error(err.stack);
  });

  req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
          req.connection.destroy();
  });

  req.on('end', () => { cb(req, res, body) });
}
