import { Router } from "express";
import { createTodo, getTodos, toggleTodo, getTodo, updateTodo, deleteTodo } from "../controllers/todo.controller.js"

const router = Router()

router.post("/", createTodo)
router.get("/", getTodos)
router.patch("/:id/toggle", toggleTodo)
router.get("/:id", getTodo)
router.patch("/:id", updateTodo)
router.delete("/:id", deleteTodo)
export default router;