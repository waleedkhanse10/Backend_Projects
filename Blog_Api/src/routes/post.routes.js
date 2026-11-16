import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/post.controller.js"
import { createComment, getPostComments } from '../controllers/comment.controller.js';

const router = Router()

router.post("/", verifyJWT, createPost)
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.patch("/:id", verifyJWT, updatePost)
router.delete("/:id", verifyJWT, deletePost)

router.post("/:id/comments", verifyJWT, createComment)
router.get("/:id/comments", getPostComments)

export default router