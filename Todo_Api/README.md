# Todo API

A REST API for managing todos with priorities, due dates and filters. Built with Node.js, Express and MongoDB (Mongoose), with centralized error handling.

## Features

- Full CRUD for todos
- Toggle a todo between done and not done
- Filter todos by `priority` and `isCompleted`
- Schema validation (required title, max length, allowed priority values)
- Centralized error handling with a custom `ApiError` class, `asyncHandler` wrapper and error middleware
- Invalid MongoDB id handling (400) and not-found handling (404)

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
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
```

For MongoDB Atlas, use your connection string instead:
`mongodb+srv://<username>:<password>@<cluster-url>`

The database name (`Todo_Api`) is added automatically in the code, so do not put it in `MONGO_URI`.

### 3. Run the server

```bash
node src/index.js
```

The server starts at `http://localhost:8000`.

## Project Structure

```
Todo_Api/
├── src/
│   ├── controllers/
│   │   └── todo.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   └── error.middleware.js
│   ├── models/
│   │   └── todo.model.js
│   ├── routes/
│   │   └── todo.route.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .env
├── .gitignore
└── package.json
```

## API Endpoints

Base URL: `/api/v1/todos`

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/v1/todos`             | Create a new todo                    |
| GET    | `/api/v1/todos`             | Get all todos (supports filters)     |
| GET    | `/api/v1/todos/:id`         | Get a single todo                    |
| PATCH  | `/api/v1/todos/:id`         | Update a todo (only the fields sent) |
| PATCH  | `/api/v1/todos/:id/toggle`  | Toggle `isCompleted` true/false      |
| DELETE | `/api/v1/todos/:id`         | Delete a todo                        |

### Filters

`GET /api/v1/todos` accepts optional query parameters:

| Param         | Values                      | Example                                          |
| ------------- | --------------------------- | ------------------------------------------------ |
| `priority`    | `low`, `medium`, `high`     | `/api/v1/todos?priority=high`                    |
| `isCompleted` | `true`, `false`             | `/api/v1/todos?isCompleted=false`                |
| both          |                             | `/api/v1/todos?priority=high&isCompleted=false`  |

## Todo Schema

| Field       | Type    | Required | Rules                                   |
| ----------- | ------- | -------- | --------------------------------------- |
| title       | String  | Yes      | trimmed, max 100 characters             |
| description | String  | No       | -                                       |
| isCompleted | Boolean | No       | default `false`                         |
| priority    | String  | No       | `low`, `medium` or `high`, default `medium` |
| dueDate     | Date    | No       | -                                       |
| createdAt   | Date    | Auto     | -                                       |
| updatedAt   | Date    | Auto     | -                                       |

## Example Requests

### Create a todo

`POST /api/v1/todos`

```json
{
  "title": "Learn Express",
  "description": "Finish the routing chapter",
  "priority": "high",
  "dueDate": "2026-12-01"
}
```

Response (201):

```json
{
  "message": "Todo Created Successfully",
  "todo": {
    "_id": "6650f1c2a1b2c3d4e5f67890",
    "title": "Learn Express",
    "description": "Finish the routing chapter",
    "isCompleted": false,
    "priority": "high",
    "dueDate": "2026-12-01T00:00:00.000Z",
    "createdAt": "2026-11-14T10:00:00.000Z",
    "updatedAt": "2026-11-14T10:00:00.000Z"
  }
}
```

### Toggle a todo

`PATCH /api/v1/todos/:id/toggle`

Flips `isCompleted` (false to true, or true to false). No request body needed.

### Error response

Invalid priority:

`POST /api/v1/todos` with `{ "title": "Test", "priority": "urgent" }`

Response (400):

```json
{
  "success": false,
  "message": "Todo validation failed: priority: `urgent` is not a valid enum value for path `priority`."
}
```

## Status Codes

| Code | Meaning                                              |
| ---- | ---------------------------------------------------- |
| 200  | Request successful                                   |
| 201  | Todo created                                         |
| 400  | Validation error, missing title or invalid todo id   |
| 404  | Todo not found                                       |
| 500  | Server or database error                             |

## Error Handling

- `ApiError`: custom error class that carries a status code
- `asyncHandler`: wraps controllers so async errors are passed to the error middleware
- `errorHandler`: one middleware that sends every error response in the same format (Mongoose validation errors are returned as 400)

## Testing

Test the endpoints with Postman or Thunder Client etc.

## Author

**Waleed Khan**
