class ApiResponse {
    message;
    success;
    data;
    statusCode;
    constructor(message, statusCode = 200, data) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode
    }
}

class ApiError extends Error {
    statusCode;
    errors;
    data;
    success;
    constructor(message = "Something went wrong", statusCode = 500, stack = "", errors = [""]) {
        super(message);
        this.message = message; //access 'this.message' from Error class (parent class) 
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;
        if (stack) {
            this.stack = stack; //access 'this.stack' from Error class (parent class) 
        }
        else {
            /* mainly here 1st arg takes the 'targetObject' on which to attack the Stack property ('this' refers to the target/current instance of ApiError Class). 2nd arg takes that constructor or object that should be not included in stackTrace */
            Error.captureStackTrace(this, ApiError);
        }
    }
}

const AsyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error)
        }
    }
}




module.exports = {
    ApiResponse,
    ApiError,
    AsyncHandler
}