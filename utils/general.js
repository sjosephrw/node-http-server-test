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
