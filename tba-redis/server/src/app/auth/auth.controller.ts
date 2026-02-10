/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

class AuthController {
    private authService = AuthService
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const newUser = await this.authService.register(req.body)

            res.status(201).json({
                message: 'User created! Please login to continue.',
                success: true,
                data: newUser,
            })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.authService.login(req.body)
            // 1. Tawagin agad ang regenerate para malinis ang lumang session ID
            req.session.regenerate((err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Session regen failed' })
                }

                // 2. DITO MO LANG ILAGAY ANG USER DATA (Kasi fresh/empty na ang session object dito)
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
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

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            // 1. Burahin ang session sa Redis
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Failed to logout' })
                }

                // Dapat match ang pangalan sa 'name' ng session config mo (default: connect.sid)
                res.clearCookie('connect.sid')

                res.status(200).json({
                    success: true,
                    message: 'Logged out ! See you later.',
                })
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error during logout' })
        }
    }
}

export const AUTH = new AuthController()
