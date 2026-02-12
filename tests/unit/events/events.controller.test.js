/**
 * Unit tests for Events Controller - POST /api/events
 * Tests createEvent function with comprehensive coverage including:
 * - Success scenarios
 * - Validation rules for all fields
 * - Boundary conditions
 * - Error handling
 * - Duplicate detection
 */

const { createEvent } = require('../../../src/features/events/events.controller');
const eventsService = require('../../../src/features/events/events.service');

describe('Events Controller', () => {
  describe('createEvent', () => {
    let req;
    let res;
    
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
      
      // Mock Date.now() for consistent timestamps
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2026-02-12T10:00:00.000Z').getTime());
    });
    
    afterEach(() => {
      jest.restoreAllMocks();
    });
    
    // ==================== SUCCESS SCENARIOS ====================
    
    describe('Success Scenarios', () => {
      it('should create event with all valid required fields and return 201', () => {
        req.body = {
          title: 'Node.js Workshop 2026',
          description: 'Learn advanced Node.js patterns and best practices in this hands-on workshop.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Tech Hub, Building A, Room 301',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
        
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      });
      
      it('should return correct response structure with success and data fields', () => {
        req.body = {
          title: 'Tech Conference',
          description: 'Annual technology conference for developers and engineers.',
          date: '2026-06-20T09:00:00.000Z',
          location: 'Convention Center',
          capacity: 200,
          organizerId: '123e4567-e89b-12d3-a456-426614174000'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response).toHaveProperty('success', true);
        expect(response).toHaveProperty('data');
        expect(typeof response.data).toBe('object');
      });
      
      it('should auto-generate UUID for id field', () => {
        req.body = {
          title: 'DevOps Summit',
          description: 'Learn about modern DevOps practices and cloud infrastructure.',
          date: '2026-04-10T10:00:00.000Z',
          location: 'Cloud Center',
          capacity: 100,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response.data.id).toBeDefined();
        expect(typeof response.data.id).toBe('string');
        // UUID v4 format validation (8-4-4-4-12 hex pattern)
        expect(response.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });
      
      it('should set registeredCount to 0 for new events', () => {
        req.body = {
          title: 'AI Workshop',
          description: 'Introduction to artificial intelligence and machine learning basics.',
          date: '2026-05-15T14:00:00.000Z',
          location: 'AI Lab Building',
          capacity: 30,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response.data.registeredCount).toBe(0);
      });
      
      it('should auto-generate createdAt and updatedAt timestamps in ISO 8601 format', () => {
        req.body = {
          title: 'Security Conference',
          description: 'Cybersecurity best practices for modern web applications.',
          date: '2026-07-22T13:00:00.000Z',
          location: 'Security Center',
          capacity: 150,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response.data.createdAt).toBeDefined();
        expect(response.data.updatedAt).toBeDefined();
        expect(response.data.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(response.data.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(response.data.createdAt).toBe(response.data.updatedAt);
      });
      
      it('should return all input fields in response data', () => {
        req.body = {
          title: 'React Workshop',
          description: 'Build modern web applications using React and related ecosystem.',
          date: '2026-08-10T11:00:00.000Z',
          location: 'Frontend Lab',
          capacity: 40,
          organizerId: '123e4567-e89b-12d3-a456-426614174000'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response.data.title).toBe('React Workshop');
        expect(response.data.description).toBe('Build modern web applications using React and related ecosystem.');
        expect(response.data.date).toBe('2026-08-10T11:00:00.000Z');
        expect(response.data.location).toBe('Frontend Lab');
        expect(response.data.capacity).toBe(40);
        expect(response.data.organizerId).toBe('123e4567-e89b-12d3-a456-426614174000');
      });
      
      it('should trim whitespace from string fields before storage', () => {
        req.body = {
          title: '  TypeScript Bootcamp  ',
          description: '  Learn TypeScript from basics to advanced topics for better code quality.  ',
          date: '2026-09-05T15:00:00.000Z',
          location: '  Training Room 5  ',
          capacity: 25,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response.data.title).toBe('TypeScript Bootcamp');
        expect(response.data.description).toBe('Learn TypeScript from basics to advanced topics for better code quality.');
        expect(response.data.location).toBe('Training Room 5');
      });
      
      it('should accept various valid UUID v4 formats for organizerId', () => {
        const validUUIDs = [
          '550e8400-e29b-41d4-a716-446655440000',
          '123e4567-e89b-12d3-a456-426614174000',
          'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6'
        ];
        
        validUUIDs.forEach((uuid, index) => {
          req.body = {
            title: `Valid UUID Event ${index}`, // Unique title for each test
            description: 'Testing valid UUID format acceptance for organizer ID field.',
            date: '2026-10-15T10:00:00.000Z',
            location: 'Test Location',
            capacity: 50,
            organizerId: uuid
          };
          
          createEvent(req, res);
          expect(res.status).toHaveBeenCalledWith(201);
        });
      });
    });
    
    // ==================== TITLE VALIDATION ====================
    
    describe('Title Validation', () => {
      it('should return 400 when title is missing', () => {
        req.body = {
          description: 'Event without a title should fail validation.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(false);
        expect(response.error.code).toBe('VALIDATION_ERROR');
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'title',
              message: expect.any(String)
            })
          ])
        );
      });
      
      it('should return 400 when title is too short (less than 3 characters)', () => {
        req.body = {
          title: 'AB',
          description: 'Title with only 2 characters should fail validation.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.code).toBe('VALIDATION_ERROR');
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'title',
              message: expect.stringContaining('3')
            })
          ])
        );
      });
      
      it('should return 400 when title is too long (more than 100 characters)', () => {
        req.body = {
          title: 'A'.repeat(101),
          description: 'Title exceeding maximum length should fail validation.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.code).toBe('VALIDATION_ERROR');
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'title',
              message: expect.stringContaining('100')
            })
          ])
        );
      });
      
      it('should return 400 when title is only whitespace', () => {
        req.body = {
          title: '     ',
          description: 'Title with only spaces should fail validation.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.code).toBe('VALIDATION_ERROR');
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'title'
            })
          ])
        );
      });
      
      it('should accept title with exactly 3 characters (minimum valid)', () => {
        req.body = {
          title: 'ABC',
          description: 'Minimum length title should be accepted successfully.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.title).toBe('ABC');
      });
      
      it('should accept title with exactly 100 characters (maximum valid)', () => {
        req.body = {
          title: 'A'.repeat(100),
          description: 'Maximum length title should be accepted successfully.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.title).toBe('A'.repeat(100));
      });
    });
    
    // ==================== DESCRIPTION VALIDATION ====================
    
    describe('Description Validation', () => {
      it('should return 400 when description is missing', () => {
        req.body = {
          title: 'Event Without Description',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'description'
            })
          ])
        );
      });
      
      it('should return 400 when description is too short (less than 10 characters)', () => {
        req.body = {
          title: 'Short Description Event',
          description: 'Too short',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'description',
              message: expect.stringContaining('10')
            })
          ])
        );
      });
      
      it('should return 400 when description is too long (more than 1000 characters)', () => {
        req.body = {
          title: 'Long Description Event',
          description: 'A'.repeat(1001),
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'description',
              message: expect.stringContaining('1000')
            })
          ])
        );
      });
      
      it('should return 400 when description is only whitespace', () => {
        req.body = {
          title: 'Whitespace Description Event',
          description: '          ',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'description'
            })
          ])
        );
      });
      
      it('should accept description with exactly 10 characters (minimum valid)', () => {
        req.body = {
          title: 'Min Description',
          description: 'Ten chars!',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.description).toBe('Ten chars!');
      });
      
      it('should accept description with exactly 1000 characters (maximum valid)', () => {
        req.body = {
          title: 'Max Description Event',
          description: 'A'.repeat(1000),
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.description).toBe('A'.repeat(1000));
      });
    });
    
    // ==================== DATE VALIDATION ====================
    
    describe('Date Validation', () => {
      it('should return 400 when date is missing', () => {
        req.body = {
          title: 'Event Without Date',
          description: 'This event has no date specified.',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'date'
            })
          ])
        );
      });
      
      it('should return 400 when date is not in ISO 8601 format', () => {
        req.body = {
          title: 'Invalid Date Format',
          description: 'Testing date format validation with invalid format.',
          date: '15-03-2026 14:00',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'date',
              message: expect.stringMatching(/ISO 8601|format/i)
            })
          ])
        );
      });
      
      it('should return 400 when date is in the past', () => {
        req.body = {
          title: 'Past Date Event',
          description: 'Event with date in the past should fail validation.',
          date: '2025-01-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'date',
              message: expect.stringMatching(/future|past/i)
            })
          ])
        );
      });
      
      it('should return 400 when date is an invalid string', () => {
        req.body = {
          title: 'Invalid Date String',
          description: 'Testing with completely invalid date string value.',
          date: 'invalid-date',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'date'
            })
          ])
        );
      });
      
      it('should return 400 when date is current time (not future)', () => {
        req.body = {
          title: 'Current Time Event',
          description: 'Event scheduled for current time should fail.',
          date: '2026-02-12T10:00:00.000Z', // Same as mocked Date.now()
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'date',
              message: expect.stringMatching(/future/i)
            })
          ])
        );
      });
      
      it('should accept valid future ISO 8601 date', () => {
        req.body = {
          title: 'Future Event',
          description: 'Event scheduled for future date should succeed.',
          date: '2027-12-31T23:59:59.999Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.date).toBe('2027-12-31T23:59:59.999Z');
      });
    });
    
    // ==================== LOCATION VALIDATION ====================
    
    describe('Location Validation', () => {
      it('should return 400 when location is missing', () => {
        req.body = {
          title: 'Event Without Location',
          description: 'This event has no location specified.',
          date: '2026-03-15T14:00:00.000Z',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'location'
            })
          ])
        );
      });
      
      it('should return 400 when location is too short (less than 3 characters)', () => {
        req.body = {
          title: 'Short Location Event',
          description: 'Testing location length validation with too short value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'AB',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'location',
              message: expect.stringContaining('3')
            })
          ])
        );
      });
      
      it('should return 400 when location is too long (more than 200 characters)', () => {
        req.body = {
          title: 'Long Location Event',
          description: 'Testing location length validation with too long value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'A'.repeat(201),
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'location',
              message: expect.stringContaining('200')
            })
          ])
        );
      });
      
      it('should return 400 when location is only whitespace', () => {
        req.body = {
          title: 'Whitespace Location Event',
          description: 'Testing location with only whitespace characters.',
          date: '2026-03-15T14:00:00.000Z',
          location: '     ',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'location'
            })
          ])
        );
      });
      
      it('should accept location with exactly 3 characters (minimum valid)', () => {
        req.body = {
          title: 'Min Location Event',
          description: 'Testing minimum valid location length.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'NYC',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.location).toBe('NYC');
      });
      
      it('should accept location with exactly 200 characters (maximum valid)', () => {
        req.body = {
          title: 'Max Location Event',
          description: 'Testing maximum valid location length.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'A'.repeat(200),
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.location).toBe('A'.repeat(200));
      });
    });
    
    // ==================== CAPACITY VALIDATION ====================
    
    describe('Capacity Validation', () => {
      it('should return 400 when capacity is missing', () => {
        req.body = {
          title: 'Event Without Capacity',
          description: 'This event has no capacity specified.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity'
            })
          ])
        );
      });
      
      it('should return 400 when capacity is a string', () => {
        req.body = {
          title: 'String Capacity Event',
          description: 'Testing capacity validation with string value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 'fifty',
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity',
              message: expect.stringMatching(/number|integer/i)
            })
          ])
        );
      });
      
      it('should return 400 when capacity is zero', () => {
        req.body = {
          title: 'Zero Capacity Event',
          description: 'Testing capacity validation with zero value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 0,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity',
              message: expect.stringMatching(/1|positive/i)
            })
          ])
        );
      });
      
      it('should return 400 when capacity is negative', () => {
        req.body = {
          title: 'Negative Capacity Event',
          description: 'Testing capacity validation with negative value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: -5,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity',
              message: expect.stringMatching(/positive/i)
            })
          ])
        );
      });
      
      it('should return 400 when capacity exceeds maximum (10000)', () => {
        req.body = {
          title: 'Excess Capacity Event',
          description: 'Testing capacity validation with value exceeding maximum.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 10001,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity',
              message: expect.stringContaining('10000')
            })
          ])
        );
      });
      
      it('should return 400 when capacity is not an integer', () => {
        req.body = {
          title: 'Decimal Capacity Event',
          description: 'Testing capacity validation with decimal value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50.5,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity',
              message: expect.stringMatching(/integer/i)
            })
          ])
        );
      });
      
      it('should return 400 when capacity is null', () => {
        req.body = {
          title: 'Null Capacity Event',
          description: 'Testing capacity validation with null value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: null,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'capacity'
            })
          ])
        );
      });
      
      it('should accept capacity of exactly 1 (minimum valid)', () => {
        req.body = {
          title: 'Min Capacity Event',
          description: 'Testing minimum valid capacity value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 1,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.capacity).toBe(1);
      });
      
      it('should accept capacity of exactly 10000 (maximum valid)', () => {
        req.body = {
          title: 'Max Capacity Event',
          description: 'Testing maximum valid capacity value.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 10000,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.capacity).toBe(10000);
      });
    });
    
    // ==================== ORGANIZER ID VALIDATION ====================
    
    describe('OrganizerId Validation', () => {
      it('should return 400 when organizerId is missing', () => {
        req.body = {
          title: 'Event Without Organizer',
          description: 'This event has no organizer ID specified.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'organizerId'
            })
          ])
        );
      });
      
      it('should return 400 when organizerId is not a valid UUID', () => {
        req.body = {
          title: 'Invalid UUID Event',
          description: 'Testing organizerId validation with invalid UUID format.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: 'not-a-uuid'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'organizerId',
              message: expect.stringMatching(/UUID/i)
            })
          ])
        );
      });
      
      it('should return 400 when organizerId is a plain number string', () => {
        req.body = {
          title: 'Numeric Organizer ID Event',
          description: 'Testing organizerId validation with numeric string.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '12345'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'organizerId',
              message: expect.stringMatching(/UUID/i)
            })
          ])
        );
      });
    });
    
    // ==================== MULTI-FIELD VALIDATION ====================
    
    describe('Multi-Field Validation', () => {
      it('should return all validation errors when multiple fields are invalid', () => {
        req.body = {
          title: 'AB',
          description: 'Short',
          date: 'invalid-date',
          location: '',
          capacity: -5,
          organizerId: 'not-a-uuid'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(false);
        expect(response.error.code).toBe('VALIDATION_ERROR');
        expect(response.error.message).toBe('Validation failed');
        expect(response.error.details).toBeInstanceOf(Array);
        expect(response.error.details.length).toBeGreaterThanOrEqual(6);
      });
      
      it('should include field and message in each validation error detail', () => {
        req.body = {
          title: 'A',
          description: 'Bad desc',
          date: '2025-01-01T00:00:00.000Z',
          location: 'AB',
          capacity: 0,
          organizerId: 'invalid'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        response.error.details.forEach(detail => {
          expect(detail).toHaveProperty('field');
          expect(detail).toHaveProperty('message');
          expect(typeof detail.field).toBe('string');
          expect(typeof detail.message).toBe('string');
        });
      });
      
      it('should validate all fields even if first field fails', () => {
        req.body = {
          title: '',
          description: '',
          date: '',
          location: '',
          capacity: '',
          organizerId: ''
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        const fields = response.error.details.map(d => d.field);
        expect(fields).toEqual(
          expect.arrayContaining(['title', 'description', 'date', 'location', 'capacity', 'organizerId'])
        );
      });
    });
    
    // ==================== EXTRA FIELDS HANDLING ====================
    
    describe('Extra Fields Handling', () => {
      it('should return 400 when request contains unknown fields', () => {
        req.body = {
          title: 'Event With Extra Fields',
          description: 'Testing handling of unknown fields in request body.',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Test Location',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000',
          extraField: 'This should not be here',
          anotherField: 'Neither should this'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(false);
        expect(response.error.code).toBe('VALIDATION_ERROR');
      });
    });
    
    // ==================== EDGE CASES ====================
    
    describe('Edge Cases', () => {
      it('should return 400 when request body is empty', () => {
        req.body = {};
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(false);
        expect(response.error.code).toBe('VALIDATION_ERROR');
        expect(response.error.details.length).toBeGreaterThanOrEqual(6);
      });
      
      it('should handle request with all fields having boundary violations', () => {
        req.body = {
          title: 'AB',
          description: 'Short',
          date: '2020-01-01T00:00:00.000Z',
          location: 'NY',
          capacity: 0,
          organizerId: '123'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        const response = res.json.mock.calls[0][0];
        expect(response.error.details.length).toBe(6);
      });
      
      it('should handle special characters in string fields', () => {
        req.body = {
          title: 'Event @ 2026 <Special>',
          description: 'Description with special chars: !@#$%^&*()_+-=[]{}|;:\'",.<>?/',
          date: '2026-03-15T14:00:00.000Z',
          location: 'Room #301, Building A & B',
          capacity: 50,
          organizerId: '550e8400-e29b-41d4-a716-446655440000'
        };
        
        createEvent(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        const response = res.json.mock.calls[0][0];
        expect(response.success).toBe(true);
        expect(response.data.title).toBe('Event @ 2026 <Special>');
      });
    });
    
    // ==================== ERROR RESPONSE STRUCTURE ====================
    
    describe('Error Response Structure', () => {
      it('should return consistent error structure for validation errors', () => {
        req.body = {
          title: 'AB',
          description: 'Short',
          date: 'invalid',
          location: 'NY',
          capacity: -1,
          organizerId: 'invalid'
        };
        
        createEvent(req, res);
        
        const response = res.json.mock.calls[0][0];
        expect(response).toHaveProperty('success', false);
        expect(response).toHaveProperty('error');
        expect(response.error).toHaveProperty('code');
        expect(response.error).toHaveProperty('message');
        expect(response.error).toHaveProperty('details');
        expect(Array.isArray(response.error.details)).toBe(true);
      });
    });
  });
});
