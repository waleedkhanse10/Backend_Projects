class ApiError extends Error {
    constructor(statusCode, message = "something went Wrong") {
        super(message);
        this.statusCode = statusCode
    }
}

export { ApiError }