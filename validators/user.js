const { ValidationError } = require('../utils/errorHandler');

exports.searchUser = (data) => {

  const errors = [];
  let errString = '';
  
  const { query, page, limit } = data;

  if (!query){
    errors.push('Please provide a valid query.\n');    
  }

  if (typeof query !== 'string'){
    errors.push('Please provide a valid query.\n');
  }

  if (page && !isNormalInteger(page)){
    errors.push('Please provide a valid number for the Page field.\n');
  }

  if (limit && !isNormalInteger(limit)){
    errors.push('Please provide a valid number for the Limit field.\n');
  }

  if (errors.length > 0){
      errString = errors.toString();
      throw new ValidationError(errString);

  }

}

//https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
const isNormalInteger = (str) => {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}
