const AppError = require('../errors/AppError');

/**
 * Global error handler middleware
 * Catches all errors and formats them according to API contract
 */
const errorHandler = (err, req, res, next) => {
  // If it's an operational error (AppError), use its properties
  if (err instanceof AppError) {
    const response = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    };

    // Add details if present (for validation errors)
    if (err.details && err.details.length > 0) {
      response.error.details = err.details;
    }

    return res.status(err.statusCode).json(response);
  }

  // For unexpected errors, log and return generic error
  console.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};

module.exports = errorHandler;
