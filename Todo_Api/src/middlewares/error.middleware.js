const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    if (err.name === "ValidationError") {
        statusCode = 400
    }

    return res.status(statusCode).json({
        success: false,
        message
    })
}

export { errorHandler }