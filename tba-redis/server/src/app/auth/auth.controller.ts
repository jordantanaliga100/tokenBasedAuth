/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { AuthService } from './auth.service'

class AuthController {
    private authService = AuthService
    // auth.controller.ts

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            // 1. Register user in DB
            const newUser = await this.authService.register(req.body)
            console.log('new user registered', newUser)

            // 2. ✨ START SESSION AUTOMATICALLY ✨
            req.session.regenerate((err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Session setup failed' })
                }

                // 3. ✨ Set user data in session object
                req.session.user = {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    is_verified: newUser.is_verified,
                }

                // 4. ✨ Save to Redis and send cookie
                req.session.save((saveErr) => {
                    if (saveErr) {
                        return res
                            .status(500)
                            .json({ success: false, message: 'Session save failed' })
                    }

                    // 5. Success response with session cookie
                    res.status(201).json({
                        message: 'User created and logged in!',
                        success: true,
                        data: newUser,
                    })
                })
            })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.authService.login(req.body)
            // 1. Tawagin agad ang regenerate para malinis ang lumang session ID
            console.log('ID before login:', req.sessionID)
            req.session.regenerate((err) => {
                console.log('ID after regenerate:', req.sessionID)
                if (err) {
                    return res.status(500).json({ success: false, message: 'Session regen failed' })
                }

                // 2. DITO MO LANG ILAGAY ANG USER DATA (Kasi fresh/empty na ang session object dito)
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    is_verified: user.is_verified,
                }
                // 3. I-save sa Redis bago mag-respond
                req.session.save((saveErr) => {
                    if (saveErr) {
                        return res
                            .status(500)
                            .json({ success: false, message: 'Session save failed' })
                    }

                    res.status(200).json({
                        success: true,
                        message: `Welcome ${user.role}!`,
                        data: user,
                    })
                })
            })
        } catch (error: any) {
            res.status(401).json({ success: false, message: error.message })
        }
    }

    me = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json({
                success: true,
                user: req.session.user,
            })
        } catch (error) {
            res.status(500).json({ success: false })
        }
    }

    requestVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Kunin ang email mula sa session (dahil naka-login na siya)
            const email = req.session.user?.email

            if (!email) {
                return res.status(401).json({ message: 'User session not found.' })
            }

            const result = await this.authService.sendVerificationEmail(email)

            res.status(200).json({
                success: true,
                message: result.message,
            })
        } catch (error) {
            next(error)
        }
    }

    verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { otp } = req.body
            const authenticatedEmail = req.session.user?.email as string

            // Tawagin ang service method na ginawa natin sa taas
            const result = await this.authService.verifyEmail(authenticatedEmail, otp)
            if (req.session.user) {
                req.session.user.is_verified = true // Ito ang mag-u-update sa Redis
            }

            res.status(200).json({
                success: true,
                message: '🔐 Account successfully verified! ',
                data: result.user,
            })
        } catch (error) {
            next(error)
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            // 1. Burahin ang session sa Redis

            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to logout' })
                }

                // Dapat match ang pangalan sa 'name' ng session config mo (default: connect.sid)
                res.clearCookie('session_id')

                res.status(200).json({
                    success: true,
                    message: 'Logged out ! See you later.',
                })
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error during logout' })
        }
    }

    sendPasswordReset = async (req: Request, res: Response) => {
        const { email } = req.body
        // Ipapasa natin ang request sa service

        const result = await this.authService.sendPasswordResetEmail(email)

        // Kahit valid o invalid ang email, laging 200 ang balik para sa security
        return res.status(200).json(result)
    }

    resetPassword = async (req: Request, res: Response) => {
        const { token, newPassword } = req.body

        // Ipapasa natin ang token at bagong password sa service
        const result = await this.authService.resetPassword(token, newPassword)

        return res.status(200).json(result)
    }
}

export const AUTH = new AuthController()
