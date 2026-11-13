# Notes API

A simple REST API for creating, reading, updating and deleting notes. Built with Node.js, Express and MongoDB (Mongoose).

## Features

- Full CRUD for notes
- Input validation (title and content are required and cannot be empty)
- Invalid MongoDB id handling (400) and not-found handling (404)
- Timestamps (`createdAt`, `updatedAt`) on every note

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

// For MongoDB Atlas, use your connection string instead:
`mongodb+srv://<username>:<password>@<cluster-url>`

```

The database name (`Notes_Api`) is added automatically in the code, so do not put it in `MONGO_URI`.

### 3. Run the server

```bash
node src/index.js
```

The server starts at `http://localhost:8000`.

## Project Structure

```
Notes_Api/
├── src/
│   ├── controllers/
│   │   └── note.controller.js
│   ├── db/
│   │   └── db.js
│   ├── models/
│   │   └── note.model.js
│   ├── routes/
│   │   └── note.route.js
│   ├── app.js
│   ├── constants.js
│   └── index.js
├── .env
├── .gitignore
└── package.json
```

## API Endpoints

Base URL: `/api/v1/notes`

| Method | Endpoint            | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| POST   | `/api/v1/notes`     | Create a new note                        |
| GET    | `/api/v1/notes`     | Get all notes                            |
| GET    | `/api/v1/notes/:id` | Get a single note                        |
| PATCH  | `/api/v1/notes/:id` | Update a note (only the fields you send) |
| DELETE | `/api/v1/notes/:id` | Delete a note                            |

## Note Schema

| Field     | Type    | Required | Default |
| --------- | ------- | -------- | ------- |
| title     | String  | Yes      | -       |
| content   | String  | Yes      | -       |
| isPinned  | Boolean | No       | false   |
| createdAt | Date    | Auto     | -       |
| updatedAt | Date    | Auto     | -       |

## Example Requests

### Create a note

`POST /api/v1/notes`

```json
{
  "title": "Shopping list",
  "content": "Milk, eggs, bread",
  "isPinned": true
}
```

Response (201):

```json
{
  "message": "Note created successfully!",
  "note": {
    "_id": "6650f1c2a1b2c3d4e5f67890",
    "title": "Shopping list",
    "content": "Milk, eggs, bread",
    "isPinned": true,
    "createdAt": "2026-11-13T10:00:00.000Z",
    "updatedAt": "2026-11-13T10:00:00.000Z"
  }
}
```

### Update a note

`PATCH /api/v1/notes/:id`

```json
{
  "title": "Updated title"
}
```

Only `title` changes; `content` and `isPinned` stay the same.

## Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | Request successful                      |
| 201  | Note created                            |
| 400  | Missing/empty fields or invalid note id |
| 404  | Note not found                          |
| 500  | Server or database error                |

## Testing

Test the endpoints with Postman or Thunder Client.

## What I Learned

- Structuring an Express project (routes, controllers, models)
- Connecting Node.js to MongoDB with Mongoose
- Validation and error handling with proper status codes
- Difference between PUT and PATCH

## Author

**Waleed Khan**
