import { Request, Response } from 'express'
import { UsersService } from './user.service'

/* eslint-disable @typescript-eslint/no-explicit-any */
class UsersController {
    private userService = UsersService

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers()
            res.status(200).json({
                success: true,
                count: users.length,
                data: users,
            })
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message })
        }
    }
}
export const USERS = new UsersController()
