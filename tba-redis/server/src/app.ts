// IMPORTS
import express, { Request, Response } from 'express'
import { BottomMiddlewares } from './middlewares/Bottom'
import { TopMiddlewares } from './middlewares/Top'
import ApiRoutes from './routes'

const app = express()

// TOP MIDDLEWARES
TopMiddlewares.forEach((mw) => app.use(mw))

// ROUTES
app.get('/', (req: Request, res: Response) => {
    // throw new Error("Testing gin index");
    res.send('Node_Express Server Alive 🛩️')
})

// ROUTES
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    })
})
ApiRoutes.forEach((route) => {
    app.use(`/api/v1/${route.path}`, route.router)
})

// BOTTOM MIDDLEWARES
BottomMiddlewares.forEach((mw) => app.use(mw))

export default app
