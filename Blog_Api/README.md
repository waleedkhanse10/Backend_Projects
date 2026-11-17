# Blog API

A REST API for a blog where users can register, write posts and comment on posts. Built with Node.js, Express and MongoDB (Mongoose), with access and refresh token authentication, pagination and search.

## Features

- User registration and login with access and refresh tokens (stored in `httpOnly` cookies)
- Passwords hashed with bcrypt (inside a Mongoose `pre("save")` hook)
- Logout (clears cookies and removes the refresh token from the database)
- Full CRUD for posts, with ownership check (only the author can edit or delete, otherwise 403)
- Comments on posts
- Pagination and search (by title) on posts
- Author name shown in responses using `populate`
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
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

For MongoDB Atlas, use your connection string instead:
`mongodb+srv://<username>:<password>@<cluster-url>`

The database name (`Blog_Api`) is added automatically in the code, so do not put it in `MONGO_URI`.

### 3. Run the server

```bash
node src/index.js
```

The server starts at `http://localhost:8000`.

## Project Structure

```
Blog_Api/
├── src/
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   └── comment.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── comment.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   └── post.routes.js
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

### Auth

Base URL: `/api/v1/auth`

| Method | Endpoint                | Description                   | Protected |
| ------ | ----------------------- | ----------------------------- | --------- |
| POST   | `/api/v1/auth/register` | Register a new user           | No        |
| POST   | `/api/v1/auth/login`    | Login and receive tokens      | No        |
| POST   | `/api/v1/auth/logout`   | Logout                        | Yes       |
| GET    | `/api/v1/auth/me`       | Get the logged-in user's data | Yes       |

### Posts

Base URL: `/api/v1/posts`

| Method | Endpoint                       | Description                      | Protected |
| ------ | ------------------------------ | -------------------------------- | --------- |
| POST   | `/api/v1/posts`                | Create a post                    | Yes       |
| GET    | `/api/v1/posts`                | Get all posts (page and search)  | No        |
| GET    | `/api/v1/posts/:id`            | Get a single post                | No        |
| PATCH  | `/api/v1/posts/:id`            | Update your own post             | Yes       |
| DELETE | `/api/v1/posts/:id`            | Delete your own post             | Yes       |
| POST   | `/api/v1/posts/:id/comments`   | Add a comment to a post          | Yes       |
| GET    | `/api/v1/posts/:id/comments`   | Get all comments of a post       | No        |

### Pagination and Search

`GET /api/v1/posts` accepts optional query parameters:

| Param    | Description                          | Example                              |
| -------- | ------------------------------------ | ------------------------------------ |
| `page`   | Page number (default 1)              | `/api/v1/posts?page=2`               |
| `limit`  | Posts per page (default 10)          | `/api/v1/posts?limit=5`              |
| `search` | Search in post titles (not case sensitive) | `/api/v1/posts?search=node`    |
| all      |                                      | `/api/v1/posts?search=node&page=1&limit=5` |

The response also includes `page`, `limit`, `total` and `totalPages`.

### Authentication

After login, the access token is set in a cookie automatically. For protected routes you can also send it in the header:

```
Authorization: Bearer <accessToken>
```

## Schemas

### User

| Field        | Type   | Required | Rules                      |
| ------------ | ------ | -------- | -------------------------- |
| name         | String | Yes      | unique, lowercase, trimmed |
| email        | String | Yes      | unique, lowercase, trimmed |
| password     | String | Yes      | stored as a bcrypt hash    |
| refreshToken | String | No       | removed on logout          |

### Post

| Field   | Type     | Required | Rules                        |
| ------- | -------- | -------- | ---------------------------- |
| title   | String   | Yes      | trimmed, max 100 characters  |
| content | String   | Yes      | trimmed                      |
| author  | ObjectId | Yes      | reference to User            |

### Comment

| Field  | Type     | Required | Rules                       |
| ------ | -------- | -------- | --------------------------- |
| text   | String   | Yes      | trimmed, max 500 characters |
| post   | ObjectId | Yes      | reference to Post           |
| author | ObjectId | Yes      | reference to User           |

## Example Requests

### Create a post

`POST /api/v1/posts`

```json
{
  "title": "My first post",
  "content": "Hello blog"
}
```

Response (201):

```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "6650f1c2a1b2c3d4e5f67890",
    "title": "My first post",
    "content": "Hello blog",
    "author": "6650f1c2a1b2c3d4e5f67111"
  }
}
```

### Add a comment

`POST /api/v1/posts/:id/comments`

```json
{
  "text": "Nice post!"
}
```

### Error response

Editing someone else's post:

`PATCH /api/v1/posts/:id`

Response (403):

```json
{
  "success": false,
  "message": "You can only edit your own post"
}
```

## Status Codes

| Code | Meaning                                         |
| ---- | ----------------------------------------------- |
| 200  | Request successful                              |
| 201  | Created                                         |
| 400  | Missing or invalid field, or invalid id         |
| 401  | Wrong password, or missing or invalid token     |
| 403  | Not the owner of the post                       |
| 404  | User, post or comment not found                 |
| 409  | User with this name or email already exists     |
| 500  | Server or database error                        |

## Error Handling

- `ApiError`: custom error class that carries a status code
- `asyncHandler`: wraps controllers so async errors are passed to the error middleware
- `errorHandler`: one middleware that sends every error response in the same format (Mongoose validation errors are returned as 400)

## Testing

Test the endpoints with Postman or Thunder Client.

## What I Learned

- Access and refresh tokens, and the difference between stateless and stateful tokens
- Mongoose `schema.methods` and `pre("save")` hooks
- References between models and `populate`
- Ownership check (401 vs 403)
- Pagination (`skip` and `limit`) and search with `$regex`
- Escaping user input before using it in a regex

## Author

**Waleed Khan**