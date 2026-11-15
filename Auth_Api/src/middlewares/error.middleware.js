const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    const message = err.message || "Internal server error"

    if (err.name === "ValidationError") {
        statusCode = 400
    }

    return res.status(statusCode).json({
        success: false,
        message
    })
}

export { errorHandler }