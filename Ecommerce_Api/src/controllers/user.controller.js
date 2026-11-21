import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
};

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => !field || String(field).trim() === "")) {
        throw new ApiError(400, "name, email and password are required");
    }

    const existingUser = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    })

    if (existingUser) {
        throw new ApiError(409, "user with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json({
        success: true,
        message: "user registered successfully",
        createdUser
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name && !email) {
        throw new ApiError(400, "username or password is required")
    }

    if (!password) {
        throw new ApiError(400, "password are required")
    }

    const user = await User.findOne({
        $or: [
            { name },
            { email }
        ]
    });

    if (!user) {
        throw new ApiError(401, "invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid email or password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
            success: true,
            message: "user logged in successfully",
            loggedInUser
        });
});

const logout = asyncHandler(async (req, res) => {
    if (req.user?._id) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                },
            },
            {
                returnDocument: after
            }
        );
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json({
            success: true,
            message: "user logged out successfully",
            data: {},
        });
});

const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "You are not authorized")
    }

    return res.status(200).json({
        success: true,
        message: "current user fetched successfully",
        data: { user },
    });
});

export {
    registerUser,
    loginUser,
    logout,
    getLoggedInUser,
};
