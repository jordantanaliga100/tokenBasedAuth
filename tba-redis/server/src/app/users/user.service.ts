/* eslint-disable @typescript-eslint/no-unused-vars */

import { pool } from '../../db/postgres/postgres'

/* eslint-disable @typescript-eslint/no-explicit-any */
class Users {
    public async getAllUsers() {
        const sql = `SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;`
        const { rows } = await pool.query(sql)
        return rows
    }
    // Para makuha ang full info ng user base sa session userId
    public async findById(id: string): Promise<any | null> {
        return null
    }

    // Para sa registration logic
    public async create(data: any): Promise<any | null> {
        return null
    }
}
export const UsersService = new Users()
