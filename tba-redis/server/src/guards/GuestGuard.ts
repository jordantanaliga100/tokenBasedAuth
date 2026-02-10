import { NextFunction, Request, Response } from 'express'
import { ErrorClass } from '../class/Error'

export default async function GuestGuards(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        throw new ErrorClass.Forbidden(
            `You are already logged in, please logout first before creating new account!`
        )
        // return res.status(400).json({
        //     success: false,
        //     message: 'Naka-login ka na lods, logout muna bago register/login ulit!',
        // })
    }

    next()
}
