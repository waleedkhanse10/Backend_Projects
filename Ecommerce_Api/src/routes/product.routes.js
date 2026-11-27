import { Router } from "express";
import { createProduct, getProducts, getProductById, deleteProduct, updateProduct } from "../controllers/product.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router()

router.post("/", verifyJwt, isAdmin, createProduct)
router.get("/", getProducts)
router.get("/:id", getProductById)
router.patch("/:id", verifyJwt, isAdmin, updateProduct)
router.delete("/:id", verifyJwt, isAdmin, deleteProduct)

export default router