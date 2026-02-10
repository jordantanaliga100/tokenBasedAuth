import 'express-session'
declare module 'express-session' {
    interface SessionData {
        views?: number
        user?: {
            id: string | number
            username?: string
            email?: string
            role?: string
            meta?: {
                ip?: string
                userAgent?: string
            }
        }
    }
}
