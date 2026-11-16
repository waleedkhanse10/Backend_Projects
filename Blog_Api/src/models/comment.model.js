import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "text should not be more than 500 characters"]
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)