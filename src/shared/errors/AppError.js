/**
 * Custom error class for application errors
 * Extends Error with statusCode and error code properties
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 400 Bad Request error (typically for validation)
   */
  static badRequest(message, details = null) {
    const error = new AppError(message, 400, 'VALIDATION_ERROR');
    if (details) {
      error.details = details;
    }
    return error;
  }

  /**
   * Create a 404 Not Found error
   */
  static notFound(message) {
    return new AppError(message, 404, 'EVENT_NOT_FOUND');
  }

  /**
   * Create a 409 Conflict error
   */
  static conflict(message, code = 'CONFLICT') {
    return new AppError(message, 409, code);
  }

  /**
   * Create a 500 Internal Server Error
   */
  static internal(message = 'An unexpected error occurred') {
    return new AppError(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = AppError;
