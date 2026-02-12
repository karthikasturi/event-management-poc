const Joi = require('joi');
const AppError = require('../../shared/errors/AppError');

/**
 * Joi schema for creating an event
 */
const createEventSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required and must be between 3 and 100 characters',
      'string.min': 'Title must be between 3 and 100 characters',
      'string.max': 'Title must be between 3 and 100 characters',
      'any.required': 'Title is required and must be between 3 and 100 characters',
    }),
  
  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required and must be between 10 and 1000 characters',
      'string.min': 'Description must be between 10 and 1000 characters',
      'string.max': 'Description must be between 10 and 1000 characters',
      'any.required': 'Description is required and must be between 10 and 1000 characters',
    }),
  
  date: Joi.date()
    .iso()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Date must be a valid ISO 8601 datetime',
      'date.format': 'Date must be a valid ISO 8601 datetime',
      'date.greater': 'Date must be a future date',
      'any.required': 'Date is required and must be a valid ISO 8601 datetime',
    }),
  
  location: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.base': 'Location must be a string',
      'string.empty': 'Location is required and must be between 3 and 200 characters',
      'string.min': 'Location is required and must be between 3 and 200 characters',
      'string.max': 'Location is required and must be between 3 and 200 characters',
      'any.required': 'Location is required and must be between 3 and 200 characters',
    }),
  
  capacity: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'number.base': 'Capacity must be a positive integer between 1 and 10000',
      'number.integer': 'Capacity must be a positive integer between 1 and 10000',
      'number.min': 'Capacity must be a positive integer between 1 and 10000',
      'number.max': 'Capacity must be a positive integer between 1 and 10000',
      'any.required': 'Capacity is required and must be a positive integer between 1 and 10000',
    }),
  
  organizerId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'OrganizerId must be a valid UUID',
      'string.guid': 'OrganizerId must be a valid UUID',
      'any.required': 'OrganizerId is required and must be a valid UUID',
    }),
});

/**
 * Middleware to validate create event request body
 */
const validateCreateEvent = (req, res, next) => {
  const { error, value } = createEventSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));

    throw AppError.badRequest('Validation failed', details);
  }

  // Replace req.body with validated and sanitized value
  req.body = value;
  next();
};

module.exports = {
  validateCreateEvent,
};
