import { ApiError } from "../utils/apiError.js";

export const isAdmin = (req, res, next) => {
    const role = req.user.role

    if (role !== "admin") {
        throw new ApiError(403, "Admin access required")
    }

    next();
}