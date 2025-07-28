declare global {
  namespace Express {
    interface CustomError extends Error {
      statusCode?: number;
      status: string;
      msg: Record<string, any>;
      isOperational?: boolean;
    }
  }
}

export {};
