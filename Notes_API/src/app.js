import express, { urlencoded } from "express"
import noteRouter from "./routes/note.route.js"

const app = express();

// middlewares
app.use(express.json({
    limit: "16kb"
}))
app.use(urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use("/api/v1/notes", noteRouter)

export { app }