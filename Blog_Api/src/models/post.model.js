import mongoose, {Schema} from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [100, "Title should not be more than 100 characters"]
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true})


export const Post = mongoose.model("Post", postSchema)