import { NextFunction, Request, Response } from 'express'
import { ErrorClass } from '../class/Error'

export default async function AuthGuards(req: Request, res: Response, next: NextFunction) {
    try {
        // I-check kung may valid session user sa Redis
        if (!req.session || !req.session.user) {
            throw new ErrorClass.Unauthorized('Unauthorized: Please login first...')
            // res.status(401).json({
            //     success: false,
            //     message: 'Unauthorized: Please login first.',
            // })
            // return
        }

        // Kung meron, proceed sa susunod na function (Controller)
        next()
    } catch (error) {
        next(error)
    }
}
