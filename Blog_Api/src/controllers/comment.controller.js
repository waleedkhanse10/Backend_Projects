import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const createComment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(404, "Id not found")
    }

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Id is not valid")
    }

    const post = await Post.findById(id)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    const { text } = req.body;

    if (!text) {
        throw new ApiError(400, "text not found")
    }

    const comment = await Comment.create({
        text,
        post: post._id,
        author: req.user._id
    })

    if (!comment) {
        throw new ApiError(500, "Some issue in creating comment")
    }

    return res.status(201).json({
        message: "comment create successfull",
        comment
    })
})

const getPostComments = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(404, "Id not found")
    }

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Id is not valid")
    }

    const post = await Post.findById(id)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    const comments = await Comment.find({
        post: id
    })
        .populate("author", "name")
        .sort({ createdAt: -1 })

    if (!comments) {
        throw new ApiError(404, "Comments not found")
    }

    return res.status(200).json({
        message: "comment fetched successfull",
        comments
    })
})

export {
    createComment,
    getPostComments
}