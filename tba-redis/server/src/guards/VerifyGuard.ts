import { NextFunction, Request, Response } from 'express'

export const VerifyGuard = (req: Request, res: Response, next: NextFunction) => {
    // 1. Check kung may login session
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized. Please login first.' })
    }

    // 2. Check kung verified na
    if (!req.session.user.is_verified) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Your email is not yet verified.',
            action: 'PLEASE_VERIFY_EMAIL', // Pwede mong gamitin 'to sa Frontend para mag-pop up yung OTP modal
        })
    }

    // Pag verified na, tuloy ang ligaya!
    next()
}
