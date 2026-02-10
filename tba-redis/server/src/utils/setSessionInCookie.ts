import type { Store } from 'express-session'
import session from 'express-session'

export const setSession = (store?: Store) => {
    const isProduction = process.env.NODE_ENV === 'production'

    return session({
        name: 'session_id',
        store, // undefined = uses in-memory store
        secret: process.env.SESSION_SECRET || 'secret',
        saveUninitialized: false,
        resave: true,
        rolling: true,
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 30, // 30 minutes
        },
    })
}
