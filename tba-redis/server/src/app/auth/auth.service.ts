/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto'
import { ErrorClass } from '../../class/Error'
import { pool } from '../../db/postgres/postgres'
import { redisClient } from '../../db/redis/redis.config'
import { EmailService } from '../../services/email.service'
import { User } from '../../types/user'
import { PasswordEncrypt } from '../../utils/encrypt'

class Auth {
    public async register(data: User) {
        const { username, email, password, role } = data

        const hashedPassword = await PasswordEncrypt.hash(password)

        const values = [username, email, hashedPassword, role || 'user']

        const sql = `
        INSERT INTO users (username, email, password, role)
        -- Dapat apat din ang placeholders ($1, $2, $3, $4)
        VALUES ($1, $2, $3, $4) 
        RETURNING id, username, email, role, is_verified, created_at;
    `
        try {
            const { rows } = await pool.query(sql, values)
            const newUser = rows[0]

            return newUser
        } catch (error: any) {
            if (error.code === '23505') {
                throw new Error('Username or Email already exists')
            }
            throw error
        }
    }

    public async login(data: { email: string; password: string }): Promise<Omit<User, 'password'>> {
        const { email, password } = data

        const sql = `SELECT id, username, email, password, role, is_verified FROM users WHERE email = $1`

        try {
            const { rows } = await pool.query(sql, [email])

            // 1. Check kung may nahanap na user
            if (rows.length === 0) {
                throw new ErrorClass.NotFound('User does not exist')
            }

            const user = rows[0] as User

            console.log('newly created user', user)

            const isMatch = await PasswordEncrypt.compare(password, user.password)
            if (!isMatch) {
                throw new ErrorClass.BadRequest('Invalid email or password')
            }

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified,
            }
        } catch (error: any) {
            throw new Error(error.message || 'Login failed')
        }
    }

    public async sendVerificationEmail(email: string) {
        // 1. Check muna kung verified na (para hindi spam)
        const userCheck = await pool.query('SELECT is_verified FROM users WHERE email = $1', [
            email,
        ])

        if (userCheck.rows[0]?.is_verified) {
            throw new ErrorClass.BadRequest('Email is already verified.')
        }
        // 2. Generate OTP (600 seconds/10 mins)
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // 3. Save to Redis
        await redisClient.set(`otp:${email}`, otp, { EX: 600 })

        // 4. Send the Email
        await EmailService.sendOTP(email, otp, 10)

        return { message: 'Verification code sent to your email!' }
    }

    public async verifyEmail(email: string, otp: string) {
        // 1. Hanapin ang OTP sa Redis
        const storedOtp = await redisClient.get(`otp:${email}`)

        // 2. Error kung expired na (wala na sa Redis) o maling email
        if (!storedOtp) {
            throw new ErrorClass.BadRequest(
                'OTP has expired or is invalid. Please request a new one.'
            )
        }

        // 3. I-compare ang input ng user sa nakasave sa Redis
        if (storedOtp !== otp) {
            throw new ErrorClass.BadRequest('Invalid verification code.')
        }

        // 4. Pag match: Update ang user sa Postgres
        const query = `UPDATE users SET is_verified = true WHERE email = $1 RETURNING id, email, is_verified;`
        const result = await pool.query(query, [email])

        if (result.rowCount === 0) {
            throw new ErrorClass.NotFound('User not found.')
        }

        // 5. Burahin na ang OTP sa Redis para hindi na magamit ulit
        await redisClient.del(`otp:${email}`)

        // 6. Sends confimation email
        await EmailService.sendVerifiedEmail(email)

        return {
            user: result.rows[0],
        }
    }

    public async sendPasswordResetEmail(email: string) {
        // 1. Check kung existing ang email sa DB (at security check na hindi verified user)
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email])
        if (userCheck.rowCount === 0) {
            // Security Tip: Huwag sabihin na "User not found" para hindi malaman ng hacker kung aling email ang valid.
            // Sabihin lang na "If an account exists, a link was sent."
            return {
                message: `If an account exists, a password reset link was sent to this email : ${email}`,
            }
        }

        // 2. Generate a long random token (hindi OTP)
        const resetToken = crypto.randomBytes(32).toString('hex')
        // 3. I-save sa Redis: `reset:token` -> `email` (may expiry)
        await redisClient.set(`reset:${resetToken}`, email, { EX: 900 })

        console.log(`[TESTING] Reset Token for ${email}: ${resetToken}`)
        // 4. Send email: `sendResetPasswordEmail(email, token)`
        await EmailService.sendResetPasswordEmail(email, resetToken)
        return { message: 'If an account exists, a password reset link will sent to your email.' }
    }

    public async resetPassword(token: string, newPassword: string) {
        // 1. I-check sa Redis kung valid at hindi pa expired ang token
        const email = await redisClient.get(`reset:${token}`)

        if (!email) {
            throw new ErrorClass.BadRequest('Password reset token is invalid or has expired.')
        }

        // 2. I-hash ang bagong password
        const hashedPassword = await PasswordEncrypt.hash(newPassword)

        // 3. I-update ang user sa DB gamit ang email
        const query = `UPDATE users SET password = $1 WHERE email = $2;`
        await pool.query(query, [hashedPassword, email])

        // 4. I-delete ang token sa Redis (para one-time use lang)
        await redisClient.del(`reset:${token}`)

        // 5. ✨ BAGONG LOGGING: Siguraduhing tumatakbo ang step na ito
        console.log(
            `[DEBUG] Database updated for ${email}. Attempting to send confirmation email...`
        )

        try {
            // 6. ✨ BAGONG ERROR HANDLING: I-wrap sa try-catch ang email sending
            await EmailService.sendPasswordChangedEmail(email)
            console.log(`[DEBUG] Confirmation email sent successfully to ${email}`)
        } catch (emailError) {
            // 🔥 LOG IT: Makikita mo ito sa docker logs kung may SMTP error
            console.error(
                `[ERROR] Failed to send password changed confirmation email to ${email}:`,
                emailError
            )

            // HINDI natin kailangang i-throw ang error dito
            // para hindi makita ng user na nag-fail ang pag-send ng email.
        }

        return { message: 'Password has been reset successfully.' }
    }
}
export const AuthService = new Auth()
