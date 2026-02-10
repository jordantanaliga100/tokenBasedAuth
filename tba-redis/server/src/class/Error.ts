export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public isOperational: boolean = true
    ) {
        super(message)
        this.status = `0`.startsWith('4') ? 'fail' : 'error'
        Error.captureStackTrace(this, this.constructor)
    }

    public status: string
}

export const ErrorClass = {
    // 400 - Client Errors
    BadRequest: class extends AppError {
        constructor(message: string = 'Bad Request') {
            super(message, 400)
        }
    },

    Unauthorized: class extends AppError {
        constructor(message: string = 'Unauthorized') {
            super(message, 401)
        }
    },

    Forbidden: class extends AppError {
        constructor(message: string = 'Forbidden') {
            super(message, 403)
        }
    },

    NotFound: class extends AppError {
        constructor(message: string = 'Not Found') {
            super(message, 404)
        }
    },

    // 422 - Validation Errors
    UnprocessableEntity: class extends AppError {
        constructor(message: string = 'Unprocessable Entity') {
            super(message, 422)
        }
    },

    // 500 - Server Errors
    InternalServer: class extends AppError {
        constructor(message: string = 'Internal Server Error') {
            super(message, 500)
        }
    },

    ServiceUnavailable: class extends AppError {
        constructor(message: string = 'Service Unavailable') {
            super(message, 503)
        }
    },
}
