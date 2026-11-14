import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createTodo = asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
        throw new ApiError(400, "Title are required")
        return;
    }

    const todo = await Todo.create({
        title,
        description,
        priority,
        dueDate
    })

    if (!todo) {
        throw new ApiError(500, "Something went wrong while creating todo")
        return;
    }

    return res.status(201).json({
        message: "Todo Created Successfully",
        todo
    })
})


export {
    createTodo,
}