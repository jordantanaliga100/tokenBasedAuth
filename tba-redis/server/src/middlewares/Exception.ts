import { NextFunction, Request, Response } from 'express'

export default function Exception(
    err: Express.CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log('HITTING THE CUSTOM ERROR', err)

    const customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong',
    }

    res.status(customError.statusCode).json({
        ERROR: customError.msg,
    })
    next()
}
