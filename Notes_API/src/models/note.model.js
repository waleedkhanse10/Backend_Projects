import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


export const Note = mongoose.model("Note", noteSchema)