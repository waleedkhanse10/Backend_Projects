import { Router } from "express";
import { registerUser, loginUser, logoutUser, getLoggedInUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyJWT, logoutUser)
router.get("/me", verifyJWT, getLoggedInUser)

export default router