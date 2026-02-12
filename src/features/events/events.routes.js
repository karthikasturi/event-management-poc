const express = require('express');
const { createEvent } = require('./events.controller');
const { validateCreateEvent } = require('./events.validation');

const router = express.Router();

// POST /api/events - Create new event
router.post('/api/events', validateCreateEvent, createEvent);

module.exports = router;
