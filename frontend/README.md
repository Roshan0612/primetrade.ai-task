# Frontend Application

Production-grade Next.js 14 web application with React, TypeScript, and TailwindCSS for task management.

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start development server
npm run dev

# App runs on http://localhost:3000
```

## Environment Variables

Create `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── app/             # Pages and layouts
├── components/      # React components
├── context/         # React Context
├── hooks/           # Custom hooks
├── lib/             # Utilities
├── types/           # TypeScript interfaces
└── styles/          # Global CSS
```

## Features

- ✓ Server-side & client-side rendering
- ✓ Protected routes with auth guard
- ✓ JWT token storage
- ✓ Form validation
- ✓ Task management UI
- ✓ Responsive design
- ✓ TypeScript strict mode
- ✓ TailwindCSS styling

## Pages

- `/` - Redirect to dashboard
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Main dashboard
- `/dashboard/tasks` - Tasks list
- `/dashboard/tasks/create` - Create task
- `/dashboard/tasks/[id]` - Edit task

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

## Authentication

Automatically:
- Stores JWT in localStorage
- Sends token in all API requests
- Handles token expiration
- Redirects to login when needed

## API Integration

All API calls through `/lib/api.ts` with:
- Automatic token injection
- Consistent error handling
- Type-safe responses
- Automatic 401 handling

## Styling

TailwindCSS with custom configuration in `tailwind.config.ts`

## Documentation

See `../README.md` for complete application documentation.

---

**Version**: 1.0.0  
**Node**: 18+  
**Status**: Production Ready
