// middlewares/bottomMiddlewares.ts
import { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express'

interface AppError extends Error {
    statusCode?: number
}

// 404 handler
const NotFound: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("<h3>Route Does not Exist</h3><a href='/'>Go Back</a>")
    next()
}

// Global error handler
const GlobalException: ErrorRequestHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('HITTING THE CUSTOM ERROR', err)

    const statusCode = err.statusCode || 500
    const message = err.message || 'Something went wrong'

    // send response only if headers not sent yet
    if (!res.headersSent) {
        res.status(statusCode).json({ ERROR: message })
    }

    next()
}

export const BottomMiddlewares = [NotFound, GlobalException]
