//https://javascript.info/custom-errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.status = 'fail';
  }
  
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.status = 'fail';
  }

}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.status = 'fail';
  }
}


module.exports = {
    ValidationError,
    NotFoundError,
    BadRequestError
}
