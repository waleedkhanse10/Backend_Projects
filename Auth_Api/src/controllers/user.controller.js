import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => {
            field?.trim() === ""
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // if already Exist check
    const existedUser = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        email,
        password: hashPassword
    })

    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    return res.status(201).json({
        message: "User Registered Successfully",
        createdUser
    })
})

const loginUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name && !email) {
        throw new ApiError(400, "username or password is required")
    }

    const user = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid user credentials");
    }

    const token = await jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_SECRET)

    if (!token) {
        throw new ApiError(500, 'Something went wrong while generating refresh and access token')
    }

    const loggedinUser = await User.findById(user._id).select(
        "-password"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.cookie("token", token, options)

    return res.status(200).json({
        message: "user login Successfully",
        loggedinUser
    })
})

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("token", options)
        .json({
            message: "user LoggedOut"
        })
})

const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = req.user

    if (!user) {
        throw new ApiError(401, "You are not authorized")
    }

    res.status(200).json({
        message: "User data",
        user: {
            "name": user.name,
            "email": user.email
        }
    })
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getLoggedInUser
}