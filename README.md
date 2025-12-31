# Scalable Web Application - Task Manager

A production-grade web application for task management with JWT-based authentication, built with Next.js 14, Express.js, MongoDB, and TailwindCSS.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Security](#security)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Authentication
- User registration with strong password validation
- Secure JWT-based login/logout
- Token expiration and refresh handling
- Protected routes on both backend and frontend

### Task Management
- Create, read, update, delete tasks (full CRUD)
- Task status management (To Do, In Progress, Completed)
- Priority levels (Low, Medium, High)
- Task tagging and search
- Pagination support
- Filter by status and priority

### User Profile
- View user information
- Update profile details
- Secure profile access (protected routes)

### Security
- bcrypt password hashing (12 salt rounds)
- Input validation and sanitization
- XSS prevention
- CSRF protection ready
- Environment configuration
- HTTPS support

## 🛠️ Tech Stack

### Backend
- **Node.js 20+** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** (jsonwebtoken) for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **Next.js 14** with App Router
- **React 18** for UI components
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **date-fns** for date formatting

## 📁 Project Structure

```
web-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and environment config
│   │   ├── models/         # MongoDB schemas (User, Task)
│   │   ├── middleware/     # Auth and error handling
│   │   ├── routes/         # API endpoint definitions
│   │   ├── controllers/    # Business logic handlers
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Helper functions (JWT, password, validation)
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages and layouts
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React context (AuthContext)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries (API, auth, validation)
│   │   ├── types/          # TypeScript interfaces
│   │   └── styles/         # Global CSS
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── .env.example
│   └── next.config.js
│
├── docs/                    # Documentation files
├── DEPLOYMENT.md           # Production deployment guide
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`:**
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/webapp
   JWT_SECRET=your-super-secret-key-min-32-chars
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or use MongoDB Atlas (update MONGODB_URI in .env)
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables in `.env.local`:**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Application runs on `http://localhost:3000`

5. **Access the application:**
   - Navigate to `http://localhost:3000`
   - Register a new account or login
   - Start managing your tasks!

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
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

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Profile Endpoints

#### Get Profile
```http
GET /profile
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update Profile
```http
PATCH /profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Complete project report",
  "description": "Finish the Q1 project report",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-01-15T00:00:00Z",
  "tags": ["work", "urgent"]
}

Response: 201 Created
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
```

#### Get Tasks (with filtering)
```http
GET /tasks?status=todo&priority=high&search=report&limit=10&page=1
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 5,
    "page": 1,
    "pages": 1,
    "limit": 10
  }
}
```

#### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "data": { ... }
}
```

#### Update Task
```http
PATCH /tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "medium"
}

Response: 200 OK
{
  "success": true,
  "message": "Task updated successfully",
  "data": { ... }
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 💻 Development

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Code Quality

Type checking:
```bash
# Backend
cd backend && npm run type-check

# Frontend
cd frontend && npm run type-check
```

Linting:
```bash
# Frontend
cd frontend && npm run lint
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## 🔒 Security

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### JWT Token
- Algorithm: HS256
- Expiration: 24 hours (configurable)
- Stored securely in localStorage

### Data Protection
- All passwords hashed with bcrypt (12 salt rounds)
- All user inputs validated and sanitized
- SQL injection prevention through Mongoose
- XSS prevention through input sanitization
- CSRF protection ready (implement on production)

### HTTPS/TLS
- All production traffic must use HTTPS
- Secure cookies with httpOnly flag
- SameSite cookie attribute enabled

## 📦 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive production deployment guide including:
- Environment configuration
- Security hardening
- Scaling strategies
- Database backup procedures
- Monitoring and logging
- Zero-downtime deployment
- Cost optimization

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Verify MongoDB is running
mongod --version

# Check connection string
# Make sure MONGODB_URI is correct in .env
```

### Token Expiration
- Check JWT_EXPIRES_IN in backend .env
- Clear localStorage if token issues persist
- Ensure clocks are synchronized

### CORS Issues
- Verify FRONTEND_URL in backend .env
- Check that frontend URL matches exactly
- Use proper credentials in API calls

### API Calls Not Working
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend .env
- Verify token is being sent in Authorization header
- Check browser console for error messages

## 📄 License

MIT

## 👥 Author

Built as a production-grade scalable web application following enterprise development patterns.

## 📞 Support

For issues and questions, please refer to:
1. [API Documentation](#api-documentation)
2. [Deployment Guide](./DEPLOYMENT.md)
3. Code comments and inline documentation
4. TypeScript types for better IDE support

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready
