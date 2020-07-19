const { ValidationError } = require('../utils/errorHandler');

exports.searchUserValidate = (data) => {

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

exports.modifyPassword = (data) => {

  const errors = [];
  let errString = '';

  const { password, passwordConfirm } = data;

  if (!password || !passwordConfirm){
    errors.push('Please fill in all fields.\n');
  }

  if (typeof password !== 'string'){
    errors.push('Please provide a valid Password.\n');
  }

  if (typeof password === 'string'){
    password.trim();
  }

  if (typeof passwordConfirm !== 'string'){
    errors.push('Please provide a valid Confirm Password.\n');
  }

  if (typeof passwordConfirm === 'string'){
    password.trim();
  }  

  if (password.length < 4 || password.length > 20){
    errors.push('Password must be greater than 4 and less than 20 characters.\n');
  }

  if (password !== passwordConfirm){
    errors.push('Password does not match Confirm password.\n');
  }

  if (errors.length > 0){
      errString = errors.toString();
      throw new ValidationError(errString);

  }

}

exports.modifyEmail = (data) => {

  const errors = [];
  let errString = '';

  const { email } = data;

  if (!email){
    errors.push('Please provide a valid Email.\n');
  }

  if (typeof email !== 'string' || !validateEmail(email)){
    errors.push('Please provide a valid Email.\n');
  }

  if (errors.length > 0){
      errString = errors.toString();
      throw new ValidationError(errString);

  }

}

//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
//https://stackoverflow.com/a/46181
const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(email.toString().toLowerCase()));
    return re.test(email.toString().toLowerCase());
}
