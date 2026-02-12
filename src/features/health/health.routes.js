/**
 * Health check routes
 * Defines routes for health monitoring endpoints
 */

const express = require('express');
const { getHealth } = require('./health.controller');

const router = express.Router();

router.get('/health', getHealth);

module.exports = router;
