import express, { urlencoded } from "express"
import { errorHandler } from "./middlewares/error.middleware.js";
import todoRouter from "./routes/todo.route.js"

const app = express();

app.use(express.json({
    limit: '16kb'
}))
app.use(urlencoded({
    extended: true,
    limit: '16kb'
}))

app.use("/api/v1/todos", todoRouter)

app.use(errorHandler)

export { app }