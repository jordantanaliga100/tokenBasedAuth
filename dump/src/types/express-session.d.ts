import "express-session";

declare module "express-session" {
  interface SessionData {
    views?: number;
    user?: {
      id: string;
      username?: string;
      email?: string;
      meta?: {
        ip?: string;
        userAgent?: string;
      };
    };
  }
}
