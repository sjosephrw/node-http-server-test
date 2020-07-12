//core modules
const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

//DB
const { get } = require('./db');

const passwordSalt = process.env.PASSWORD_SALT;

exports.isEmailTaken = async (email) => {

    try {
      const res = await get().collection("users").findOne({ "email": email }); 
      
      //console.log('utils/user isEmailTaken', res);
      
      if (res){
        return true;
      } else {
        return false;
      }     
    } catch(e){
      console.log('Error', e);
    }
      
}


const scryptAsync = promisify(scrypt);


exports.hashPassword = async (password) => {

    try {
        //https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback
        const derivedKey = await scryptAsync(password, passwordSalt, 32);
        //console.log('hashPassword, utils/user', derivedKey.toString('hex'));
        return derivedKey.toString('hex');
    } catch(e){
        console.log('Error', e);
    }
  
}

exports.isThePasswordCorrect = async (password, dbPassword) => {

    try {
        //https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback
        const derivedKey = await scryptAsync(password, passwordSalt, 32);
        console.log('isThePasswordCorrect, utils/user', derivedKey.toString('hex'), 'DB Password -> ', dbPassword);
        return derivedKey.toString('hex') === dbPassword ? true : false;
        
    } catch(e){
        console.log('Error', e);
    }    
}
