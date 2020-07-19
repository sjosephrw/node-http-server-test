const { ValidationError } = require('../utils/errorHandler');

exports.signUp = (data) => {

  const errors = [];
  let errString = '';

  const { email, password, passwordConfirm } = data;

  if (!email || !password || !passwordConfirm){
    errors.push('Please fill in all fields.\n');
  }

  if (typeof email !== 'string' || !validateEmail(email)){
    errors.push('Please provide a valid Email.\n');
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

exports.signIn = (data) => {

  const errors = [];
  let errString = '';

  const { email, password } = data;

  if (!email && !password){
    errors.push('Please provide a valid Email and Password.\n');
  }

  if (typeof email !== 'string' || !validateEmail(email)){
    errors.push('Please provide a valid Email.\n');
  }

  if (password && typeof password === 'string'){
    password.trim();
  }

  if (typeof password !== 'string'){
    errors.push('Please provide a valid Password.\n');
  }

  if (password.length < 4 || password.length > 20){
    errors.push('Password must be greater than 4 and less than 20 characters.\n');
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
