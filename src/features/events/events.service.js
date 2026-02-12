const { v4: uuidv4 } = require('uuid');
const AppError = require('../../shared/errors/AppError');

// In-memory storage for events (POC)
const events = [];

/**
 * Creates a new event
 * @param {Object} eventData - Event data from request (should be pre-validated)
 * @returns {Object} Created event with generated fields
 */
const createEvent = (eventData) => {
  const { title, description, date, location, capacity, organizerId } = eventData;

  // Defensive check - date should be a valid date string
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    throw AppError.badRequest('Validation failed', [
      { field: 'date', message: 'Date must be a valid ISO 8601 datetime' }
    ]);
  }

  // Check for duplicate event (same title and date) 
  const duplicate = events.find(
    (event) =>
      event.title.toLowerCase() === title.toLowerCase() &&
      new Date(event.date).getTime() === eventDate.getTime()
  );

  if (duplicate) {
    throw AppError.conflict(
      'Event with same title and date already exists',
      'DUPLICATE_EVENT'
    );
  }

  // Create new event with generated fields
  const now = new Date().toISOString();
  const newEvent = {
    id: uuidv4(),
    title,
    description,
    date: eventDate.toISOString(), // Ensure consistent ISO format
    location,
    capacity,
    organizerId,
    registeredCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Store event
  events.push(newEvent);

  return newEvent;
};

/**
 * Get all events (used for duplicate checking and future functionality)
 * @returns {Array} Array of all events
 */
const getAllEvents = () => {
  return events;
};

/**
 * Clear all events (for testing purposes)
 */
const clearEvents = () => {
  events.length = 0;
};

module.exports = {
  createEvent,
  getAllEvents,
  clearEvents,
};
