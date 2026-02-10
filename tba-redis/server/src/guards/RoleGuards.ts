import { NextFunction, Request, Response } from 'express'
import { ErrorClass } from '../class/Error'
export const RoleGuards = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.session?.user

        if (!user) {
            throw new ErrorClass.Unauthorized('Unauthorized: Please login first...')
            // return res.status(401).json({ success: false, message: 'Unauthorized: Please Login !' })
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as string)) {
            throw new ErrorClass.Forbidden(
                `Forbidden: You need to be ${allowedRoles.join(' or ')} to access this resource.`
            )
            // return res.status(403).json({
            //     success: false,
            //     message: `Forbidden: You need to be ${allowedRoles.join(' or ')} to access this resource.`,
            // })
        }
        next()
    }
}
