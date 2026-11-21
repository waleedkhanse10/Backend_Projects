import jwt from "jsonwebtoken"  
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const { accessToken } = req.cookies || req.header("Authorization")?.replace("Bearer ", "")

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized access")
        }

        const decodedToken = jwt.verify(accessToken, process.envACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(401, 'Unauthorized access')
        }

        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401, "invalid access token")
    }
})