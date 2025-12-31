# API Documentation

## Overview

Complete REST API documentation for the Scalable Web Application. All endpoints follow RESTful principles and return JSON responses with consistent formatting.

## Base URL

```
Development:  http://localhost:5000/api
Production:   https://api.example.com/api
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* response payload */ },
  "message": "Operation completed successfully",
  "pagination": { /* optional pagination info */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descriptive error message",
    "statusCode": 400
  }
}
```

## Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (email/username) |
| 500 | Server Error | Internal server error |

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_CREDENTIALS | 401 | Email/password incorrect |
| USER_NOT_FOUND | 404 | User doesn't exist |
| EMAIL_EXISTS | 409 | Email already registered |
| USERNAME_EXISTS | 409 | Username already taken |
| INVALID_TOKEN | 401 | Token is malformed/invalid |
| TOKEN_EXPIRED | 401 | Token has expired |
| UNAUTHORIZED | 401 | Authentication required |
| VALIDATION_ERROR | 400 | Input validation failed |
| TASK_NOT_FOUND | 404 | Task doesn't exist |
| INTERNAL_ERROR | 500 | Server error |

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| email | string | Yes | Valid email format, max 254 chars |
| username | string | Yes | 3-30 chars, alphanumeric with - or _ |
| password | string | Yes | Min 8 chars, uppercase, lowercase, number |
| firstName | string | Yes | Non-empty string |
| lastName | string | Yes | Non-empty string |

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

**Error Examples:**
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_EXISTS",
    "message": "User with this email already exists",
    "statusCode": 409
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

---

### POST /auth/login

Authenticate user and obtain JWT token.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| email | string | Yes | Valid email format |
| password | string | Yes | Min 8 characters |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
}
```

**Token Details:**
- **Expires in**: 24 hours
- **Algorithm**: HS256
- **Contains**: userId, email, iat, exp

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

---

### POST /auth/logout

Logout user (invalidates token on frontend).

**Request:**
```http
POST /auth/logout
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Profile Endpoints

### GET /profile

Get current user's profile information.

**Request:**
```http
GET /profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://example.com/image.jpg",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-15T14:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### PATCH /profile

Update user profile information.

**Request:**
```http
PATCH /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "profileImage": "https://example.com/new-image.jpg"
}
```

**Parameters:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| firstName | string | No | New first name |
| lastName | string | No | New last name |
| profileImage | string | No | Profile image URL |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

---

## Task Endpoints

### POST /tasks

Create a new task.

**Request:**
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete quarterly report",
  "description": "Finish and submit Q1 report to management",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-02-15T00:00:00Z",
  "tags": ["work", "important"]
}
```

**Parameters:**
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| title | string | Yes | Non-empty, max 200 chars |
| description | string | No | Max 5000 chars |
| priority | enum | No | 'low', 'medium', 'high' (default: 'medium') |
| status | enum | No | 'todo', 'in_progress', 'completed' (default: 'todo') |
| dueDate | ISO 8601 | No | Valid date format |
| tags | string[] | No | Array of tag strings |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Complete quarterly report",
    "description": "Finish and submit Q1 report to management",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-02-15T00:00:00.000Z",
    "tags": ["work", "important"],
    "createdAt": "2025-01-15T14:30:00.000Z",
    "updatedAt": "2025-01-15T14:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete quarterly report",
    "priority": "high",
    "tags": ["work"]
  }'
```

---

### GET /tasks

List all tasks with optional filtering and pagination.

**Request:**
```http
GET /tasks?status=todo&priority=high&search=report&limit=20&page=1
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | enum | all | Filter by 'todo', 'in_progress', 'completed' |
| priority | enum | all | Filter by 'low', 'medium', 'high' |
| search | string | - | Full-text search in title and description |
| limit | number | 10 | Items per page (1-100) |
| page | number | 1 | Page number (1-based) |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "title": "Complete quarterly report",
      "description": "Finish and submit Q1 report",
      "priority": "high",
      "status": "todo",
      "dueDate": "2025-02-15T00:00:00.000Z",
      "tags": ["work"],
      "createdAt": "2025-01-15T14:30:00.000Z",
      "updatedAt": "2025-01-15T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 1,
    "limit": 20
  }
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/tasks?status=todo&priority=high&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### GET /tasks/:id

Get a specific task by ID.

**Request:**
```http
GET /tasks/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "title": "Complete quarterly report",
    "description": "Finish and submit Q1 report",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-02-15T00:00:00.000Z",
    "tags": ["work"],
    "createdAt": "2025-01-15T14:30:00.000Z",
    "updatedAt": "2025-01-15T14:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found",
    "statusCode": 404
  }
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### PATCH /tasks/:id

Update a specific task.

**Request:**
```http
PATCH /tasks/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "medium",
  "description": "Updated description"
}
```

**Parameters:**
All task fields are optional. Send only fields to update.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": { /* updated task object */ }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "medium"
  }'
```

---

### DELETE /tasks/:id

Delete a specific task.

**Request:**
```http
DELETE /tasks/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found",
    "statusCode": 404
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Rate Limiting

Currently not implemented but recommended for production:

**Suggested Implementation:**
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute per user for authenticated endpoints
- 5 requests per minute for auth endpoints (register/login)

Return HTTP 429 (Too Many Requests) when exceeded.

---

## Best Practices

### Token Management
1. Store token securely (httpOnly cookies in production)
2. Include token in every protected request
3. Handle token expiration (401 response) by redirecting to login
4. Clear token on logout

### Pagination
1. Always provide limit and page parameters for list endpoints
2. Use reasonable limits (10-100 items per page)
3. Check pagination info in response

### Error Handling
1. Check success flag first
2. Use error code for specific handling
3. Display user-friendly message from error.message
4. Log errors for debugging

### Security
1. Validate all inputs on client side
2. Never expose sensitive data in URLs
3. Use HTTPS in production (not HTTP)
4. Keep token confidential

---

## Postman Collection

Import the provided `postman_collection.json` for easy API testing:

1. Download the collection file
2. Open Postman
3. Click "Import"
4. Select the JSON file
5. Set `baseUrl` variable to your API endpoint
6. Set `accessToken` variable after login

---

## Changelog

### Version 1.0 (January 2025)
- Initial API release
- Authentication endpoints
- Profile management
- Task CRUD operations
- Task filtering and search

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**API Version**: v1
