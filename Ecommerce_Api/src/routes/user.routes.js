import { Router } from "express";
import { registerUser, loginUser, logout, getLoggedInUser } from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register")
router.post("/login")
router.post("/logout")
router.get("/me")

export default router