module.exports.globalErrorHandler = (error, req, res, next) => {
    res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        stackTrace: error.stack,
        errors: error.errors,
    })
}