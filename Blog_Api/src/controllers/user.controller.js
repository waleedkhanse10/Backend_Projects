import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (
        [name, email, password].some((field) => {
            return field?.trim() === ""
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

    const user = await User.create({
        name,
        email,
        password
    })

    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
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

    if (!password) {
        throw new ApiError(400, "Password are required")
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

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    if (!accessToken || !refreshToken) {
        throw new ApiError(500, 'Something went wrong while generating refresh and access token')
    }

    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "user login Successfully",
            loggedinUser
        })
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            returnDocument: "after"
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
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