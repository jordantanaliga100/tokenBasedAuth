import cors from 'cors'
import express, { RequestHandler } from 'express'
import expressSession from 'express-session'
import { sessionConfig } from '../db/redis/redis.config'

export const TopMiddlewares: RequestHandler[] = [
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }),
    express.json(),
    express.urlencoded({ extended: true }),
    express.static('./public'),
    expressSession(sessionConfig),
]
