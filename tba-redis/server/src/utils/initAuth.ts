import { Express } from 'express'
import { setSession } from './setSessionInCookie'

export const initAuth = (mode: string, app: Express) => {
    switch (mode) {
        case 'session':
            console.log('🧠 Using session-based auth (in-memory store)')
            app.use(setSession()) // no store passed
            break

        case 'session_store':
            console.log('🧠 Using session-based auth (redis store)')
            break

        case 'token':
        default:
            console.log('🔐 Using token-based auth (stateless)')
            // No middleware needed
            break
    }
}
