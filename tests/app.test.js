const request = require('supertest');
const app = require('../src/app');

describe('Express App', () => {
  it('should respond to GET /health with 200 status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
