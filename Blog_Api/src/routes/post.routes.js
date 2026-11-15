import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts } from "../controllers/post.controller.js"

const router = Router()

router.post("/", verifyJWT, createPost)
router.get("/", getAllPosts)

export default router