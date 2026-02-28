import session from 'express-session'
import { redisStore } from '../db/redis/redis.config'

export const setSession = () => {
    const isProduction = process.env.NODE_ENV === 'production'

    return session({
        name: 'session_id',
        store: redisStore, // undefined = uses in-memory store
        secret: process.env.SESSION_SECRET || 'secret',
        saveUninitialized: false,
        resave: false,
        rolling: true,
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 30, // 30 minutes
        },
    })
}
