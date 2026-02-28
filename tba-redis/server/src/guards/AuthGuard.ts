import { NextFunction, Request, Response } from 'express'

export default async function AuthGuard(req: Request, res: Response, next: NextFunction) {
    try {
        // I-check kung may valid session user sa Redis
        if (!req.session || !req.session.user) {
            // throw new ErrorClass.Unauthorized('Unauthorized: Please login first...')
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Please login first.',
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}
