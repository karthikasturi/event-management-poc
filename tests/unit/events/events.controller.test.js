/**
 * Unit tests for Events Controller - POST /api/events
 * 
 * These tests focus on the controller's responsibilities:
 * - Delegating to the service
 * - Formatting successful responses (201, success: true, data)
 * - Passing service errors to error handler via next()
 * 
 * Note: Validation is tested separately in validation middleware tests.
 * Controller receives pre-validated data from validation middleware.
 */

const { createEvent } = require('../../../src/features/events/events.controller');
const eventsService = require('../../../src/features/events/events.service');

describe('Events Controller', () => {
  describe('createEvent', () => {
    let req;
    let res;
    let next;
    
    beforeEach(() => {
      // Clear events storage before each test
      eventsService.clearEvents();
      
      // Reset mocks before each test
      req = {
        body: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
      
      // Mock Date.now() for consistent timestamps
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-02-12T10:00:00.000Z').getTime());
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    // ==================== SUCCESS SCENARIOS ====================
    
    describe('Success Scenarios', () => {
      it('should create event with valid data and return 201 with success response', async () => {
        req.body = {
          title: 'Node.js Workshop 2026',
          description: 'Learn advanced Node.js patterns and best practices in this hands-on workshop.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Tech Hub, Building A, Room 301',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
        
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      });
      
      it('should return response with correct structure (success and data fields)', async () => {
        req.body = {
          title: 'Tech Conference',
          description: 'Annual technology conference for developers and engineers.',
          date: '2026-06-20T09:00:00.000Z',
          location: 'Convention Center',
          capacity: 200,
          organizerId: '123e4567-e89b-12d3-a456-426614174000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        const response = res.json.mock.calls[0][0];
        expect(response).toHaveProperty('success', true);
        expect(response).toHaveProperty('data');
        expect(typeof response.data).toBe('object');
      });
      
      it('should include auto-generated UUID in response data', async () => {
        req.body = {
          title: 'DevOps Summit',
          description: 'Explore modern DevOps practices, CI/CD pipelines, and containerization.',
          date: '2026-09-10T10:00:00.000Z',
          location: 'Innovation Lab',
          capacity: 150,
          organizerId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        const response = res.json.mock.calls[0][0];
        expect(response.data).toHaveProperty('id');
        expect(typeof response.data.id).toBe('string');
        expect(response.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });
      
      it('should include timestamps (createdAt, updatedAt) in response data', async () => {
        req.body = {
          title: 'Cloud Architecture Workshop',
          description: 'Deep dive into cloud architecture patterns and best practices.',
          date: '2026-10-15T13:00:00.000Z',
          location: 'Cloud Center',
          capacity: 80,
          organizerId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        const response = res.json.mock.calls[0][0];
        expect(response.data).toHaveProperty('createdAt');
        expect(response.data).toHaveProperty('updatedAt');
        expect(typeof response.data.createdAt).toBe('string');
        expect(typeof response.data.updatedAt).toBe('string');
        expect(response.data.createdAt).toBe(response.data.updatedAt);
      });
      
      it('should include registeredCount initialized to 0 in response', async () => {
        req.body = {
          title: 'AI/ML Conference',
          description: 'Latest trends in artificial intelligence and machine learning technologies.',
          date: '2026-11-20T09:00:00.000Z',
          location: 'AI Research Center',
          capacity: 300,
          organizerId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        const response = res.json.mock.calls[0][0];
        expect(response.data).toHaveProperty('registeredCount', 0);
      });
      
      it('should preserve all input fields in response data', async () => {
        const eventData = {
          title: 'Security Best Practices',
          description: 'Learn about application security, OWASP top 10, and secure coding practices.',
          date: '2026-12-05T14:00:00.000Z',
          location: 'Security Lab, Building B',
          capacity: 60,
          organizerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
        };
        
        req.body = eventData;
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        const response = res.json.mock.calls[0][0];
        expect(response.data.title).toBe(eventData.title);
        expect(response.data.description).toBe(eventData.description);
        expect(response.data.date).toBe(eventData.date);
        expect(response.data.location).toBe(eventData.location);
        expect(response.data.capacity).toBe(eventData.capacity);
        expect(response.data.organizerId).toBe(eventData.organizerId);
      });
      
      it('should successfully create multiple different events', async () => {
        const event1 = {
          title: 'React Workshop',
          description: 'Build modern React applications with hooks and best practices.',
          date: '2026-03-20T10:00:00.000Z',
          location: 'Frontend Lab',
          capacity: 40,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        const event2 = {
          title: 'Python Data Science',
          description: 'Analyze data using pandas, numpy, and scikit-learn libraries.',
          date: '2026-04-15T14:00:00.000Z',
          location: 'Data Lab',
          capacity: 35,
          organizerId: '123e4567-e89b-12d3-a456-426614174000'
        };
        
        req.body = event1;
        await createEvent(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        
        // Reset mocks
        res.status.mockClear();
        res.json.mockClear();
        next.mockClear();
        
        req.body = event2;
        await createEvent(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
      });
      
      it('should handle events with minimum valid capacity (1)', async () => {
        req.body = {
          title: 'One-on-One Mentoring Session',
          description: 'Personalized mentoring session for career guidance and technical skills.',
          date: '2027-01-10T15:00:00.000Z',
          location: 'Mentor Room',
          capacity: 1,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.capacity).toBe(1);
      });
      
      it('should handle events with maximum valid capacity (10000)', async () => {
        req.body = {
          title: 'Mega Tech Festival',
          description: 'The largest technology festival with exhibits, talks, and workshops for everyone.',
          date: '2027-06-01T09:00:00.000Z',
          location: 'International Convention Center',
          capacity: 10000,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.capacity).toBe(10000);
      });
    });
    
    // ==================== SERVICE ERROR HANDLING ====================
    
    describe('Service Error Handling', () => {
      it('should pass duplicate event error to error handler (next)', async () => {
        const eventData = {
          title: 'Duplicate Event',
          description: 'This event will be created twice to test duplicate detection.',
          date: '2026-08-15T10:00:00.000Z',
          location: 'Test Location',
          capacity: 100,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        // Create first event
        req.body = eventData;
        await createEvent(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        
        // Reset mocks
        res.status.mockClear();
        res.json.mockClear();
        next.mockClear();
        
        // Try to create duplicate event
        req.body = eventData;
        await createEvent(req, res, next);
        
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        
        const error = next.mock.calls[0][0];
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe('Event with same title and date already exists');
      });
      
      it('should detect duplicate with case-insensitive title matching', async () => {
        const event1 = {
          title: 'JavaScript Workshop',
          description: 'Learning JavaScript fundamentals and advanced concepts.',
          date: '2026-09-20T10:00:00.000Z',
          location: 'Code Lab',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        // Create first event
        req.body = event1;
        await createEvent(req, res, next);
        expect(next).not.toHaveBeenCalled();
        
        // Reset mocks
        res.status.mockClear();
        res.json.mockClear();
        next.mockClear();
        
        // Try with different case
        req.body = {
          ...event1,
          title: 'JAVASCRIPT WORKSHOP' // Different case, same title
        };
        await createEvent(req, res, next);
        
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(409);
      });
      
      it('should allow same title with different dates', async () => {
        const baseEvent = {
          title: 'Monthly Meetup',
          description: 'Regular monthly meetup for developers to network and share knowledge.',
          location: 'Community Center',
          capacity: 75,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        // Create first event
        req.body = {
          ...baseEvent,
          date: '2026-05-10T18:00:00.000Z'
        };
        await createEvent(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        
        // Reset mocks
        res.status.mockClear();
        res.json.mockClear();
        next.mockClear();
        
        // Create event with same title but different date
        req.body = {
          ...baseEvent,
          date: '2026-06-10T18:00:00.000Z' // Different month
        };
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
      });
      
      it('should pass invalid date error to error handler', async () => {
        req.body = {
          title: 'Invalid Date Event',
          description: 'This event has an invalid date string that cannot be parsed.',
          date: 'not-a-valid-date',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        
        const error = next.mock.calls[0][0];
        expect(error).toBeDefined();
        expect(error.statusCode).toBe(400);
        expect(error.details).toBeDefined();
        expect(error.details[0].field).toBe('date');
      });
    });
    
    // ==================== EDGE CASES ====================
    
    describe('Edge Cases', () => {
      it('should handle event with minimum length title (3 chars)', async () => {
        req.body = {
          title: 'ABC',
          description: 'Event with minimum allowed title length for testing boundaries.',
          date: '2027-02-20T10:00:00.000Z',
          location: 'Test Venue',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.title).toBe('ABC');
      });
      
      it('should handle event with maximum length title (100 chars)', async () => {
        const longTitle = 'A'.repeat(100);
        req.body = {
          title: longTitle,
          description: 'Event with maximum allowed title length for testing field boundaries.',
          date: '2027-03-15T10:00:00.000Z',
          location: 'Test Venue',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.title).toBe(longTitle);
        expect(response.data.title.length).toBe(100);
      });
      
      it('should handle event with minimum length description (10 chars)', async () => {
        req.body = {
          title: 'Minimum Description Event',
          description: '1234567890', // Exactly 10 characters
          date: '2027-04-10T10:00:00.000Z',
          location: 'Test Venue',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.description).toBe('1234567890');
      });
      
      it('should handle event with maximum length description (1000 chars)', async () => {
        const longDesc = 'x'.repeat(1000);
        req.body = {
          title: 'Maximum Description Event',
          description: longDesc,
          date: '2027-05-20T10:00:00.000Z',
          location: 'Test Venue',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.description.length).toBe(1000);
      });
      
      it('should handle event with minimum length location (3 chars)', async () => {
        req.body = {
          title: 'Location Boundary Test',
          description: 'Testing minimum location field length boundary condition.',
          date: '2027-06-15T10:00:00.000Z',
          location: 'ABC',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.location).toBe('ABC');
      });
      
      it('should handle event very far in the future', async () => {
        req.body = {
          title: 'Future Event 2050',
          description: 'Event scheduled very far in the future to test date boundaries.',
          date: '2050-12-31T23:59:59.000Z',
          location: 'Future Venue',
          capacity: 100,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        await createEvent(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.data.date).toBe('2050-12-31T23:59:59.000Z');
      });
    });
  });
});
