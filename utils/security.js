//3rd party modules
const xss = require("xss");

exports.xssFilter = (data) => {
    
    let filteredObj = {};

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
          filteredObj[key] = xss(data[key]);
        }
    }
    
    return filteredObj;
}


