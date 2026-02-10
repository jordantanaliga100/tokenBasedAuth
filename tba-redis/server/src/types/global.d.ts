declare global {
    namespace Express {
        export interface CustomError extends Error {
            statusCode?: number
            status: string | number
            msg: Record<string, unknown>
            isOperational?: boolean
        }

        export interface Request {
            user?: unknown
            session?: {
                user?: unknown
            }
        }
    }
}
export {}
