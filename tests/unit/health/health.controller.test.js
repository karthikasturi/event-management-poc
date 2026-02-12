/**
 * Unit tests for health controller
 */

const { getHealth } = require('../../../src/features/health/health.controller');

describe('Health Controller', () => {
  describe('getHealth', () => {
    it('should return status ok with 200', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      getHealth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
    });
  });
});
