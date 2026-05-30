# Full-Stack Authentication App (Angular + Node.js + MongoDB)

This is a complete full-stack authentication application using Angular (latest) for the frontend, Node.js with Express.js for the backend, and MongoDB for the database.

## Features

- **Frontend (Angular)**
  - Standalone components and Reactive Forms with validations
  - Login, Register, and Dashboard pages
  - Angular Material UI (Spinners, Snackbars, Cards)
  - Route Guards to protect Dashboard
  - HTTP Interceptor to automatically attach JWT tokens

- **Backend (Node.js/Express)**
  - RESTful APIs for User Registration, Login, and fetching current user info
  - Password hashing using `bcryptjs`
  - JWT Authentication middleware
  - Duplicate email validation and proper error handling
  
- **Database (MongoDB/Mongoose)**
  - User schema (name, email, password, gender, createdAt)
  - Unique index on email

## Project Structure

```
├── backend/
│   ├── controllers/      # Route controllers (authController.js)
│   ├── middleware/       # Custom middleware (auth.js)
│   ├── models/           # Mongoose schemas (User.js)
│   ├── routes/           # Express routes (authRoutes.js)
│   ├── .env.example      # Example environment variables
│   ├── server.js         # Entry point for backend
│   └── package.json
└── frontend/
    └── auth-app/
        ├── src/
        │   ├── app/
        │   │   ├── core/     # Services, guards, interceptors
        │   │   ├── pages/    # Login, Register, Dashboard components
        │   │   ├── app.routes.ts
        │   │   ├── app.config.ts
        │   │   └── app.ts
        │   └── main.ts
        └── package.json
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017 or a MongoDB Atlas connection string)

### 2. Backend Setup
```bash
cd backend
npm install
# Copy .env.example to .env and configure if needed
cp .env.example .env
# Run server
node server.js
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend/auth-app
npm install
# Run frontend
npx ng serve
# App runs on http://localhost:4200
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Get logged-in user details (Requires Bearer Token)

## Sample MongoDB Document
```json
{
  "_id": "647f1b2...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",
  "gender": "Male",
  "createdAt": "2023-06-06T12:00:00.000Z"
}
```

## API Testing Examples (cURL)

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Alice", "email": "alice@test.com", "password": "password123", "gender": "Female"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "alice@test.com", "password": "password123"}'
```
