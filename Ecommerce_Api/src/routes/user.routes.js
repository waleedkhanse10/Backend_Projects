import { Router } from "express";
import { registerUser, loginUser, logout, getLoggedInUser } from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyJwt, logout)
router.get("/me", verifyJwt, getLoggedInUser)

export default router