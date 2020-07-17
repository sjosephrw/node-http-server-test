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

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAuthorizedError';
    this.statusCode = 403;
    this.status = 'fail';
  }
}

class NotAuthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAuthenticatedError';
    this.statusCode = 401;
    this.status = 'fail';
  }
}

module.exports = {
    ValidationError,
    NotFoundError,
    BadRequestError,
    NotAuthorizedError,
    NotAuthenticatedError
}
