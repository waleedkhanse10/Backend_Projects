import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)