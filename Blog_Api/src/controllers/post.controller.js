import { Post } from "../models/post.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import mongoose from "mongoose";

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
    const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 })

    return res.status(200).json({
        message: "All posts retrieved successfully",
        posts
    })
})

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Id is not valid")
    }

    const post = await Post.findById(id).populate("author", "name")

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    return res.status(200).json({
        message: "Successfull Petch",
        post
    })
})

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(404, "Id not found")
    }

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Id is not valid")
    }

    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "post not found")
    }

    const isOwner = post.author.toString() === req.user._id.toString();

    if (!isOwner) {
        throw new ApiError(403, "You can only edit your own post")
    }

    const { title, content } = req.body;

    if (title !== undefined) {
        post.title = title
    }

    if (content !== undefined) {
        post.content = content
    }

    await post.save()

    return res.status(200).json({
        message: "post updated successfull",
        post
    })
})

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(404, "Id not found")
    }

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Id is not valid")
    }

    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "post not found")
    }

    const isOwner = post.author.toString() === req.user._id.toString();

    if (!isOwner) {
        throw new ApiError(403, "You can only edit your own post")
    }

    await post.deleteOne()

    return res.status(200).json({
        message: "Post delete Successfull"
    })
})

export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
}
