# Auth API

A REST API for user authentication with registration, login, logout and a protected route. Built with Node.js, Express and MongoDB (Mongoose), using bcrypt for password hashing and JWT for authentication.

## Features

- User registration with unique name and email
- Passwords hashed with bcrypt (never stored in plain text)
- Login with JWT, token is stored in an `httpOnly` cookie
- Logout (clears the cookie)
- Protected routes using an auth middleware (`verifyJWT`)
- Token accepted from the cookie or the `Authorization: Bearer <token>` header
- Centralized error handling with a custom `ApiError` class, `asyncHandler` wrapper and error middleware

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_secret_key
```

For MongoDB Atlas, use your connection string instead:
`mongodb+srv://<username>:<password>@<cluster-url>`

The database name (`Auth_Api`) is added automatically in the code, so do not put it in `MONGO_URI`.

### 3. Run the server

```bash
node src/index.js
```

The server starts at `http://localhost:8000`.

## Project Structure

```
Auth_Api/
├── src/
│   ├── controllers/
│   │   └── user.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── utils/
│   │   ├── apiError.js
│   │   └── asyncHandler.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .env
├── .gitignore
└── package.json
```

## API Endpoints

Base URL: `/api/v1/auth`

| Method | Endpoint                | Description                       | Protected |
| ------ | ----------------------- | --------------------------------- | --------- |
| POST   | `/api/v1/auth/register` | Register a new user               | No        |
| POST   | `/api/v1/auth/login`    | Login and receive a token         | No        |
| POST   | `/api/v1/auth/logout`   | Logout (clears the cookie)        | Yes       |
| GET    | `/api/v1/auth/me`       | Get the logged-in user's data     | Yes       |

### Authentication

After login, the token is set in a cookie automatically. For protected routes you can also send it in the header:

```
Authorization: Bearer <token>
```

## User Schema

| Field     | Type   | Required | Rules                           |
| --------- | ------ | -------- | ------------------------------- |
| name      | String | Yes      | unique, lowercase, trimmed      |
| email     | String | Yes      | unique, lowercase, trimmed      |
| password  | String | Yes      | stored as a bcrypt hash         |
| createdAt | Date   | Auto     | -                               |
| updatedAt | Date   | Auto     | -                               |

## Example Requests

### Register

`POST /api/v1/auth/register`

```json
{
  "name": "waleed",
  "email": "waleed@example.com",
  "password": "123456"
}
```

Response (201):

```json
{
  "message": "User Registered Successfully",
  "createdUser": {
    "_id": "6650f1c2a1b2c3d4e5f67890",
    "name": "waleed",
    "email": "waleed@example.com",
    "createdAt": "2026-11-15T10:00:00.000Z",
    "updatedAt": "2026-11-15T10:00:00.000Z"
  }
}
```

### Login

`POST /api/v1/auth/login`

```json
{
  "email": "waleed@example.com",
  "password": "123456"
}
```

You can log in with either `name` or `email`.

Response (200):

```json
{
  "message": "user login Successfully",
  "loggedinUser": {
    "_id": "6650f1c2a1b2c3d4e5f67890",
    "name": "waleed",
    "email": "waleed@example.com"
  }
}
```

### Get logged-in user

`GET /api/v1/auth/me`

Response (200):

```json
{
  "message": "User data",
  "user": {
    "name": "waleed",
    "email": "waleed@example.com"
  }
}
```

### Error response

Wrong password:

`POST /api/v1/auth/login` with a wrong `password`

Response (401):

```json
{
  "success": false,
  "message": "invalid user credentials"
}
```

## Status Codes

| Code | Meaning                                              |
| ---- | ---------------------------------------------------- |
| 200  | Request successful                                   |
| 201  | User registered                                      |
| 400  | Missing field (name, email or password)              |
| 401  | Wrong password, or missing/invalid token             |
| 404  | User does not exist                                  |
| 409  | User with this name or email already exists          |
| 500  | Server or database error                             |

## Error Handling

- `ApiError`: custom error class that carries a status code
- `asyncHandler`: wraps controllers so async errors are passed to the error middleware
- `errorHandler`: one middleware that sends every error response in the same format (Mongoose validation errors are returned as 400)

## Testing

Test the endpoints with Postman or Thunder Client.

## What I Learned

- Hashing passwords with bcrypt and comparing them on login
- Creating and verifying JWT tokens
- Storing the token in an `httpOnly` cookie
- Writing an auth middleware to protect routes
- Using `.select("-password")` to keep passwords out of responses

## Author

**Waleed Khan**