import mongoose, { mongo } from "mongoose";
import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createTodo = asyncHandler(async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
        throw new ApiError(400, "Title are required")
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

const getTodos = asyncHandler(async (req, res) => {
    const { isCompleted, priority } = req.query;

    const filter = {}

    if (priority) {
        filter.priority = priority
    }

    if (isCompleted !== undefined) {
        filter.isCompleted = isCompleted === "true"
    }

    const todos = await Todo.find(filter)

    return res.status(200).json({
        message: "Todos fetched successfully",
        count: todos.length,
        todos
    })
})

const toggleTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "invalid todo id")
    }

    const todo = await Todo.findById(id)

    if (!todo) {
        throw new ApiError(404, "Todo not found")
    }

    todo.isCompleted = !todo.isCompleted;

    await todo.save();

    return res.status(200).json({
        message: "Toggle successfull",
        todo
    })
})

const getTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "invalid todo id")
    }

    const todo = await Todo.findById(id);

    if (!todo) {
        throw new ApiError(404, "Todo not found")
    }

    return res.status(200).json({
        message: "Todo fetched successfull",
        todo
    })
})

const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "invalid todo id")
    }

    const todo = await Todo.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!todo) {
        throw new ApiError(404, "Todo not found")
    }

    return res.status(200).json({
        message: "Todo updated successfull",
        todo
    })
})

const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "invalid todo id")
    }

    const todo = await Todo.findByIdAndDelete(
        id
    );

    if (!todo) {
        throw new ApiError(404, "Todo not found")
    }

    return res.status(200).json({
        message: "Todo Deleted successfull",
        todo
    })
})

export {
    createTodo,
    getTodos,
    toggleTodo,
    getTodo,
    updateTodo,
    deleteTodo
}