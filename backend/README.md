# Backend API Server

Production-grade Express.js REST API with JWT authentication, MongoDB integration, and comprehensive task management functionality.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

## Environment Variables

Create `.env` file with:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/webapp
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
src/
├── config/          # Configuration modules
├── models/          # MongoDB schemas
├── middleware/      # Express middleware
├── routes/          # API endpoint definitions
├── controllers/     # Request handlers
├── services/        # Business logic
├── utils/           # Helper functions
├── types/           # TypeScript interfaces
└── index.ts         # Server entry point
```

## Key Features

- ✓ JWT-based authentication
- ✓ Password hashing with bcrypt
- ✓ MongoDB integration
- ✓ Input validation & sanitization
- ✓ Error handling
- ✓ CORS support
- ✓ TypeScript strict mode
- ✓ Production-ready code

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login & get token
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Development

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
```

### Production Start
```bash
npm start
```

## Database

Requires MongoDB running locally or MongoDB Atlas connection string in `.env`

### Collections
- **users** - User accounts with indexed email and username
- **tasks** - User tasks with status and priority

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire after 24 hours
- All inputs validated and sanitized
- CORS configured
- XSS prevention
- Error messages sanitized

## Documentation

See `../API_CONTRACTS.md` for complete API documentation.

---

**Version**: 1.0.0  
**Node**: 18+  
**Status**: Production Ready
