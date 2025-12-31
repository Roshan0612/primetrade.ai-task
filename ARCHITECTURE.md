# System Architecture

## Overview

This document describes the architecture of the scalable web application, detailing the system design, components, data flow, and deployment considerations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         Next.js 14 (App Router) + TypeScript             │  │
│  │    • Pages: Auth, Dashboard, Tasks                       │  │
│  │    • Protected Routes with JWT Verification             │  │
│  │    • TailwindCSS Styling                                │  │
│  │    • Secure JWT Storage (localStorage)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / BFF                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │     Node.js + Express (TypeScript)                       │  │
│  │    • JWT Authentication Middleware                       │  │
│  │    • Request Validation & Sanitization                   │  │
│  │    • Global Error Handler                                │  │
│  │    • Consistent API Responses                            │  │
│  │    • CORS Configuration                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                    ↓ Mongoose ODM
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            MongoDB (NoSQL Database)                       │  │
│  │    • Users Collection (indexed: email, username)         │  │
│  │    • Tasks Collection (indexed: userId, status, etc.)   │  │
│  │    • Full-text Search Index                              │  │
│  │    • Automatic Backups                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Client Layer)

**Technology Stack:**
- Next.js 14 with App Router
- React 18 for UI components
- TypeScript for type safety
- TailwindCSS for styling

**Key Features:**
- Server-side and client-side rendering
- Automatic code splitting
- Image optimization
- Built-in API routes support
- File-based routing

**Directory Structure:**
```
frontend/src/
├── app/                  # Pages and layouts
│   ├── auth/            # Authentication pages
│   └── dashboard/       # Protected dashboard pages
├── components/          # Reusable components
├── context/             # React Context (Auth)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (API, auth, validation)
├── types/               # TypeScript interfaces
└── styles/              # Global CSS
```

### Backend (API Layer)

**Technology Stack:**
- Express.js for REST API
- TypeScript for type safety
- JWT for stateless authentication
- bcrypt for password hashing
- Mongoose for MongoDB ODM

**Middleware Stack:**
```
Request → CORS → JSON Parser → Auth Middleware → Route Handler → Error Handler → Response
```

**Key Components:**

1. **Routes**: HTTP endpoints definition
2. **Controllers**: Request handling and response formatting
3. **Services**: Business logic (optional layer)
4. **Models**: Database schema definitions
5. **Middleware**: Cross-cutting concerns (auth, validation, errors)
6. **Utils**: Reusable functions (JWT, passwords, validators)

### Data Layer (MongoDB)

**Collections:**

1. **Users**
   ```javascript
   {
     _id: ObjectId,
     email: String (unique, indexed),
     username: String (unique, indexed),
     password: String (bcrypt hashed),
     firstName: String,
     lastName: String,
     profileImage: String (optional),
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **Tasks**
   ```javascript
   {
     _id: ObjectId,
     userId: ObjectId (ref to User, indexed),
     title: String,
     description: String,
     status: Enum ['todo', 'in_progress', 'completed'],
     priority: Enum ['low', 'medium', 'high'],
     dueDate: Date (optional),
     tags: [String],
     createdAt: Date,
     updatedAt: Date
   }
   ```

**Indexes:**
- User: `email` (unique), `username` (unique)
- Task: `userId`, `userId + status`, `userId + priority`, `title + description` (text)

## Authentication Flow

```
1. USER REGISTRATION
   └─ POST /auth/register
      └─ Validate input
      └─ Hash password (bcrypt)
      └─ Create user in DB
      └─ Return user info

2. USER LOGIN
   └─ POST /auth/login
      └─ Find user by email
      └─ Verify password
      └─ Generate JWT token (24h expiry)
      └─ Return token + user info

3. PROTECTED REQUEST
   └─ Request with Authorization header
      └─ Verify JWT signature
      └─ Check expiration
      └─ Extract userId from payload
      └─ Attach user to request
      └─ Process request

4. TOKEN EXPIRATION
   └─ Client detects 401 error
   └─ Clear stored token
   └─ Redirect to login
   └─ User logs in again
```

## API Response Format

All endpoints return consistent response format:

**Success Response (2xx):**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* payload */ },
  "pagination": { /* optional */ }
}
```

**Error Response (4xx, 5xx):**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "statusCode": 400
  }
}
```

## Security Architecture

### Authentication
- **Algorithm**: HS256 (HMAC SHA-256)
- **Storage**: localStorage (httpOnly in production)
- **Expiration**: 24 hours (configurable)
- **Refresh**: Manual re-login on expiration

### Password Security
- **Algorithm**: bcrypt with 12 salt rounds
- **Validation**: Min 8 chars, uppercase, lowercase, number
- **Never**: Stored in plaintext or returned to client

### Input Validation
- Server-side validation for all inputs
- Whitelist approach for validation
- Type checking with TypeScript
- Sanitization against XSS

### Data Protection
- HTTPS/TLS in production (enforce)
- Secure cookies with flags
- CORS configured for specific origins
- Rate limiting ready for implementation

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ↓
┌─────────────────────────┐
│ Backend Instance 1      │
│ Backend Instance 2      │
│ Backend Instance N      │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ MongoDB Replica Set     │
│ (Primary + Replicas)    │
└─────────────────────────┘
```

### Caching Strategy
- Redis for session caching
- Database query results caching
- CDN for static assets
- Browser caching headers

### Database Optimization
- Connection pooling
- Query optimization with indexes
- Pagination for large datasets
- Aggregate pipeline for complex queries

### Performance Metrics
- API response time: < 200ms
- Database query time: < 50ms
- Frontend load time: < 3s
- 99.9% uptime SLA

## Deployment Architecture

### Development Environment
```
Local Machine
├─ Backend (localhost:5000)
├─ Frontend (localhost:3000)
└─ MongoDB (localhost:27017)
```

### Production Environment
```
┌─────────────────────────────────────────┐
│           CDN / CloudFlare              │
│     (Static Assets + DDoS Protection)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Load Balancer (AWS ELB / Nginx)     │
└─────────────────────────────────────────┘
                    ↓
         ┌──────────┴──────────┐
         ↓                     ↓
    ┌─────────────┐      ┌─────────────┐
    │  Backend 1  │      │  Backend 2  │
    │  Backend 3  │      │  Backend N  │
    └─────────────┘      └─────────────┘
         │                     │
         └─────────┬───────────┘
                   ↓
    ┌─────────────────────────────┐
    │   MongoDB Atlas Cluster     │
    │  (Primary + 2 Replicas)     │
    │  + Automated Backups        │
    └─────────────────────────────┘
         ↓
    ┌─────────────────────────────┐
    │   Cloud Storage (S3, GCS)   │
    │   + Backup Archives         │
    └─────────────────────────────┘
```

### Kubernetes Deployment
```yaml
Frontend Pod (Next.js)
  - 2-3 replicas
  - Auto-scaling based on CPU/memory

Backend Pod (Express.js)
  - 3-5 replicas
  - Health checks every 10s
  - Rolling updates

MongoDB StatefulSet
  - Primary + 2 secondary replicas
  - Persistent volumes for data
  - Automated backups
```

## Monitoring & Logging

### Metrics to Track
- API latency (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- Memory and CPU usage
- Active user sessions
- Failed authentication attempts

### Logging Strategy
- Structured logging (JSON format)
- Log levels: INFO, WARN, ERROR, DEBUG
- Centralized log aggregation (ELK, DataDog)
- Request/response logging
- Database query logging (slow query log)

### Alerting
- API error rate > 1%
- Database connection pool exhaustion
- Server down or unresponsive
- Authentication failures spike
- Disk space critical

## Disaster Recovery

### Backup Strategy
- Daily automated database backups
- Multi-region backup replication
- 30-day retention policy
- Monthly full restore tests

### High Availability
- Multi-AZ deployment
- Automated failover
- Load balancer health checks
- Circuit breakers for external services

### Recovery Time Objectives
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 1 hour

## Version Control & CI/CD

### Git Workflow
```
main (production)
  ↑
release branch
  ↑
develop branch
  ↑
feature branches
```

### CI/CD Pipeline
```
Git Push → Tests → Build → Security Scan → Deploy to Staging → Manual Approval → Deploy to Production
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Production Ready
