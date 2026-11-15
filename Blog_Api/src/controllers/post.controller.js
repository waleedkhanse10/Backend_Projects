import { Post } from "../models/post.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"

const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }

    const post = await Post.create({
        title,
        content,
        author: req.user._id
    });

    if (!post) {
        throw new ApiError(500, "Post creation failed");
    }

    return res.status(201).json({
        message: "Post created successfully",
        post
    })
})

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate("author", "name").sort({createdAt: -1})

    return res.status(200).json({
        message: "All posts retrieved successfully",
        posts
    })
})

export {
    createPost,
    getAllPosts
}
