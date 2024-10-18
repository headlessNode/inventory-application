class CustomNotFoundError extends Error {
    constructor(message){
        super(message);
        this.statusCode = 404;
        this.name = "NotFoundError";
    }
}

class CustomBadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = "BadRequestError";
    }
}

class CustomInternalServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        this.name = "InternalServerError";
    }
}

module.exports = {
    CustomNotFoundError,
    CustomBadRequestError,
    CustomInternalServerError
};