import { Product } from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    if ([name, description, category].some(
        (field) => !field || String(field).trim() === ''
    )) {
        throw new ApiError(400, 'Name, description and category are required');
    }

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        createdBy: req.user._id
    })

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    })
})

const getProducts = asyncHandler(async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    const category = String(req.query.category || "")
    const search = String(req.query.search || "")
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10))

    const filter = {}

    if (search) {
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        filter.name = { $regex: escaped, $options: "i" }
    }

    if (category) {
        filter.category = category.toLowerCase()
    }

    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice && !Number.isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice)
        if (maxPrice && !Number.isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice)
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / limit)

    const products = await Product.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        page,
        limit,
        total,
        totalPages,
        data: products
    })
})

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product id")
    }

    const product = await Product.findById(id)
        .populate("createdBy", "name")

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product id")
    }

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
        throw new ApiError(404, 'product not found')
    }

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: { product: product.name }
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid product id")
    }

    const product = await Product.findById(id)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    const { name, description, price, stock, category } = req.body;

    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (stock !== undefined) product.stock = stock
    if (category !== undefined) product.category = category
    if (price !== undefined) product.price = price


    await product.save()

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    })
})


export {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct
}