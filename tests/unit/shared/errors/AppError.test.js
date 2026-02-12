/**
 * Unit tests for AppError custom error class
 */

const AppError = require('../../../../src/shared/errors/AppError');

describe('AppError', () => {
  describe('constructor', () => {
    it('should create an AppError with message, statusCode, and code', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
    });

    it('should set default statusCode to 500 if not provided', () => {
      const error = new AppError('Server error', undefined, 'SERVER_ERROR');

      expect(error.statusCode).toBe(500);
    });

    it('should set default code to INTERNAL_SERVER_ERROR if not provided', () => {
      const error = new AppError('Unknown error', 500);

      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should capture stack trace', () => {
      const error = new AppError('Stack test', 400, 'STACK_TEST');

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('static factory methods', () => {
    it('should create validation error with badRequest', () => {
      const details = [
        { field: 'title', message: 'Title is required' },
        { field: 'date', message: 'Date must be valid' }
      ];
      const error = AppError.badRequest('Validation failed', details);

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual(details);
    });

    it('should create not found error', () => {
      const error = AppError.notFound('Event not found with id: 123');

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('EVENT_NOT_FOUND');
      expect(error.message).toBe('Event not found with id: 123');
    });

    it('should create conflict error', () => {
      const error = AppError.conflict('Duplicate event', 'DUPLICATE_EVENT');

      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('DUPLICATE_EVENT');
      expect(error.message).toBe('Duplicate event');
    });

    it('should create internal server error', () => {
      const error = AppError.internal('Something went wrong');

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_SERVER_ERROR');
      expect(error.message).toBe('Something went wrong');
    });
  });
});
