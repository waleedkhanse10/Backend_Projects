class ApiError extends Error {
    constructor(statusCode, message = "Something went Wrong!!!") {
        super(message),
            this.statusCode = statusCode
    }
}

export { ApiError }