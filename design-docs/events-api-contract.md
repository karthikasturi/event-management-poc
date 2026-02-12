# Events API Contract

## Overview

This document defines the Input/Output contract for the Events CRUD API endpoints.

**Base URL:** `/api/events`

**Date Format:** ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

---

## Endpoints

### 1. Create Event

**POST** `/api/events`

Creates a new event.

#### Request Body

```json
{
  "title": "string (required, 3-100 chars)",
  "description": "string (required, 10-1000 chars)",
  "date": "string (required, ISO 8601 datetime)",
  "location": "string (required, 3-200 chars)",
  "capacity": "number (required, positive integer, min: 1, max: 10000)",
  "organizerId": "string (required, UUID format)"
}
```

#### Success Response

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "title": "string",
    "description": "string",
    "date": "string (ISO 8601)",
    "location": "string",
    "capacity": "number",
    "organizerId": "string (UUID)",
    "registeredCount": 0,
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

#### Error Responses

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

**Status:** `409 Conflict`

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EVENT",
    "message": "Event with same title and date already exists"
  }
}
```

---

### 2. Get All Events

**GET** `/api/events`

Retrieves a list of all events with optional filtering and pagination.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number (min: 1) |
| limit | number | No | 10 | Items per page (min: 1, max: 100) |
| status | string | No | all | Filter by status: `upcoming`, `past`, `all` |
| organizerId | string | No | - | Filter by organizer UUID |
| search | string | No | - | Search in title and description |

#### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string",
      "date": "string (ISO 8601)",
      "location": "string",
      "capacity": "number",
      "organizerId": "string (UUID)",
      "registeredCount": "number",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

#### Error Responses

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUERY_PARAMS",
    "message": "Invalid query parameters",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

---

### 3. Get Event by ID

**GET** `/api/events/:id`

Retrieves a single event by its ID.

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The event ID |

#### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "title": "string",
    "description": "string",
    "date": "string (ISO 8601)",
    "location": "string",
    "capacity": "number",
    "organizerId": "string (UUID)",
    "registeredCount": "number",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

#### Error Responses

**Status:** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found with id: {id}"
  }
}
```

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "INVALID_EVENT_ID",
    "message": "Invalid event ID format"
  }
}
```

---

### 4. Update Event

**PUT** `/api/events/:id`

Updates an existing event (full update).

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The event ID |

#### Request Body

```json
{
  "title": "string (required, 3-100 chars)",
  "description": "string (required, 10-1000 chars)",
  "date": "string (required, ISO 8601 datetime)",
  "location": "string (required, 3-200 chars)",
  "capacity": "number (required, positive integer, min: registeredCount, max: 10000)"
}
```

#### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "title": "string",
    "description": "string",
    "date": "string (ISO 8601)",
    "location": "string",
    "capacity": "number",
    "organizerId": "string (UUID)",
    "registeredCount": "number",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

#### Error Responses

**Status:** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found with id: {id}"
  }
}
```

**Status:** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

**Status:** `409 Conflict`

```json
{
  "success": false,
  "error": {
    "code": "CAPACITY_CONFLICT",
    "message": "Capacity cannot be less than current registered count"
  }
}
```

---

### 5. Partially Update Event

**PATCH** `/api/events/:id`

Partially updates an existing event (only provided fields).

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The event ID |

#### Request Body

All fields are optional. Only include fields to be updated.

```json
{
  "title": "string (optional, 3-100 chars)",
  "description": "string (optional, 10-1000 chars)",
  "date": "string (optional, ISO 8601 datetime)",
  "location": "string (optional, 3-200 chars)",
  "capacity": "number (optional, positive integer, min: registeredCount, max: 10000)"
}
```

#### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "string (UUID)",
    "title": "string",
    "description": "string",
    "date": "string (ISO 8601)",
    "location": "string",
    "capacity": "number",
    "organizerId": "string (UUID)",
    "registeredCount": "number",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

#### Error Responses

Same as PUT endpoint.

---

### 6. Delete Event

**DELETE** `/api/events/:id`

Deletes an event by its ID.

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string (UUID) | The event ID |

#### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### Error Responses

**Status:** `404 Not Found`

```json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found with id: {id}"
  }
}
```

**Status:** `409 Conflict`

```json
{
  "success": false,
  "error": {
    "code": "DELETE_CONFLICT",
    "message": "Cannot delete event with active registrations"
  }
}
```

---

## Common Error Responses

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Data Model

### Event Object

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| id | UUID | Yes (auto) | - | Unique event identifier |
| title | string | Yes | 3-100 chars | Event title |
| description | string | Yes | 10-1000 chars | Event description |
| date | datetime | Yes | ISO 8601, future date | Event date and time |
| location | string | Yes | 3-200 chars | Event location |
| capacity | number | Yes | 1-10000 | Maximum attendees |
| organizerId | UUID | Yes | Valid UUID | Event organizer ID |
| registeredCount | number | Yes (auto) | 0-capacity | Current registrations |
| createdAt | datetime | Yes (auto) | ISO 8601 | Creation timestamp |
| updatedAt | datetime | Yes (auto) | ISO 8601 | Last update timestamp |

---

## Validation Rules

### Title
- Required field
- Minimum length: 3 characters
- Maximum length: 100 characters
- Cannot be only whitespace

### Description
- Required field
- Minimum length: 10 characters
- Maximum length: 1000 characters
- Cannot be only whitespace

### Date
- Required field
- Must be valid ISO 8601 datetime format
- Must be a future date (for creation)
- Cannot be in the past when creating new events

### Location
- Required field
- Minimum length: 3 characters
- Maximum length: 200 characters
- Cannot be only whitespace

### Capacity
- Required field
- Must be a positive integer
- Minimum: 1
- Maximum: 10000
- When updating, must be >= registeredCount

### OrganizerId
- Required field (only for creation)
- Must be valid UUID format
- Cannot be changed after creation

---

## Status Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Operation conflicts with current state |
| 500 | Internal Server Error - Unexpected server error |

---

## Examples

### Example 1: Create Event

**Request:**
```http
POST /api/events HTTP/1.1
Content-Type: application/json

{
  "title": "Node.js Workshop 2026",
  "description": "Learn advanced Node.js patterns and best practices in this hands-on workshop.",
  "date": "2026-03-15T14:00:00.000Z",
  "location": "Tech Hub, Building A, Room 301",
  "capacity": 50,
  "organizerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Node.js Workshop 2026",
    "description": "Learn advanced Node.js patterns and best practices in this hands-on workshop.",
    "date": "2026-03-15T14:00:00.000Z",
    "location": "Tech Hub, Building A, Room 301",
    "capacity": 50,
    "organizerId": "550e8400-e29b-41d4-a716-446655440000",
    "registeredCount": 0,
    "createdAt": "2026-02-12T10:30:00.000Z",
    "updatedAt": "2026-02-12T10:30:00.000Z"
  }
}
```

### Example 2: Get All Events with Filters

**Request:**
```http
GET /api/events?page=1&limit=10&status=upcoming&search=workshop HTTP/1.1
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Node.js Workshop 2026",
      "description": "Learn advanced Node.js patterns and best practices in this hands-on workshop.",
      "date": "2026-03-15T14:00:00.000Z",
      "location": "Tech Hub, Building A, Room 301",
      "capacity": 50,
      "organizerId": "550e8400-e29b-41d4-a716-446655440000",
      "registeredCount": 23,
      "createdAt": "2026-02-12T10:30:00.000Z",
      "updatedAt": "2026-02-12T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Example 3: Validation Error

**Request:**
```http
POST /api/events HTTP/1.1
Content-Type: application/json

{
  "title": "AB",
  "description": "Short",
  "date": "invalid-date",
  "location": "",
  "capacity": -5,
  "organizerId": "not-a-uuid"
}
```

**Response:**
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title must be between 3 and 100 characters"
      },
      {
        "field": "description",
        "message": "Description must be between 10 and 1000 characters"
      },
      {
        "field": "date",
        "message": "Date must be a valid ISO 8601 datetime"
      },
      {
        "field": "location",
        "message": "Location is required and must be between 3 and 200 characters"
      },
      {
        "field": "capacity",
        "message": "Capacity must be a positive integer between 1 and 10000"
      },
      {
        "field": "organizerId",
        "message": "OrganizerId must be a valid UUID"
      }
    ]
  }
}
```

---

## Notes

1. All datetime values use ISO 8601 format (UTC)
2. UUID v4 format is used for all IDs
3. All responses include a `success` boolean field
4. Error responses follow consistent structure with `code` and `message`
5. Validation errors include detailed `details` array with field-specific messages
6. Capacity cannot be reduced below current `registeredCount`
7. Events with active registrations cannot be deleted (return 409 Conflict)
8. The `organizerId` field is immutable after creation
9. Pagination defaults: page=1, limit=10
10. Maximum pagination limit: 100 items per page
