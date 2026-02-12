const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Feature routes
const healthRoutes = require('./features/health/health.routes');
const eventsRoutes = require('./features/events/events.routes');

// Error handler
const errorHandler = require('./shared/middleware/errorHandler');

// Mount routes
app.use('/', healthRoutes);
app.use('/', eventsRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
