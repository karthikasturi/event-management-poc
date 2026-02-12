const eventsService = require('./events.service');
const asyncHandler = require('../../shared/utils/asyncHandler');

/**
 * Controller for creating a new event
 * POST /api/events
 */
const createEvent = asyncHandler(async (req, res) => {
  const event = eventsService.createEvent(req.body);

  res.status(201).json({
    success: true,
    data: event,
  });
});

module.exports = {
  createEvent,
};
