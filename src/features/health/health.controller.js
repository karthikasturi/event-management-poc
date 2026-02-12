/**
 * Health check controller
 * Provides health status endpoint for service monitoring
 */

const getHealth = (req, res) => {
  res.status(200).json({ status: 'ok' });
};

module.exports = {
  getHealth,
};
