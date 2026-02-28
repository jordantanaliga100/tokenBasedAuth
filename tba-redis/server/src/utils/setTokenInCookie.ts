import { Response } from 'express'
export const setToken = (res: Response, token: string) => {
    res.cookie('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: Date.now() + 1000 * 10,
    })
}
