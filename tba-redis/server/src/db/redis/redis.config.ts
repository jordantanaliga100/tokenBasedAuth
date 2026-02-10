import { RedisStore } from 'connect-redis'
import { createClient } from 'redis'

// 1. Initialize Redis Client agad
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
})

// Connect at handle error
redisClient.connect().catch(console.error)

// 2. I-setup ang Store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
})

// 3. I-export ang session middleware
export const sessionConfig = {
    store: redisStore, // Force Redis Store
    secret: process.env.SESSION_SECRET || 'pogi-secret-key',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 30, // 30 minutes
    },
}

// 🉐🉐🉐 OLD WAY !

// import session from 'express-session'
// import { createClient, RedisClientType } from 'redis'

// // 1. Initialize Redis Client na may tamang Type
// const redisClient: RedisClientType = createClient({
//     url: `redis://${process.env.REDIS_HOST || 'redis'}:${process.env.REDIS_PORT || 6379}`,
// })

// redisClient.connect().catch(console.error)

// // 2. Custom Store - Kailangan natin sundin ang abstract class ng session.Store
// class MyRedisStore extends session.Store {
//     private client: RedisClientType
//     private prefix: string = 'sess:'

//     constructor(client: RedisClientType) {
//         super()
//         this.client = client
//     }

//     // Kinukuha ang session (Dapat may callback support at tamang Return Type)
//     public override async get(
//         sid: string,
//         callback: (err: any, session?: session.SessionData | null) => void
//     ): Promise<void> {
//         try {
//             const data = await this.client.get(this.prefix + sid)
//             if (!data) return callback(null, null)

//             // I-parse ang string pabalik sa SessionData object
//             const parsed = JSON.parse(data)
//             callback(null, parsed)
//         } catch (err) {
//             callback(err)
//         }
//     }

//     // Sine-save ang session
//     public override async set(
//         sid: string,
//         sessionData: session.SessionData,
//         callback?: (err?: any) => void
//     ): Promise<void> {
//         try {
//             // Kalkulahin ang TTL (seconds) base sa maxAge ng cookie
//             const maxAge = sessionData.cookie.maxAge
//             const ttl = maxAge ? Math.floor(maxAge / 1000) : 1800 // Default 30 mins

//             await this.client.set(this.prefix + sid, JSON.stringify(sessionData), {
//                 EX: ttl,
//             })

//             if (callback) callback(null)
//         } catch (err) {
//             if (callback) callback(err)
//         }
//     }

//     // Dine-delete ang session
//     public override async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
//         try {
//             await this.client.del(this.prefix + sid)
//             if (callback) callback(null)
//         } catch (err) {
//             if (callback) callback(err)
//         }
//     }
// }

// // 3. I-export ang session middleware
// export const sessionConfig: session.SessionOptions = {
//     store: new MyRedisStore(redisClient),
//     secret: process.env.SESSION_SECRET || 'pogi-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     rolling: true,
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 1000 * 60 * 30, // 30 minutes
//     },
// }

// export const sessionMiddleware = session(sessionConfig)
