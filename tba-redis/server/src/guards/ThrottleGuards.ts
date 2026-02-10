import rateLimit from 'express-rate-limit'
export const ThrottleGaurds = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // 5 attempts lang bago ma-block
    message: {
        success: false,
        message: `Too many attempts. Please try again after 5 minutes.`,
    },
    standardHeaders: true, // Ipapakita sa headers kung ilan na lang ang remaining attempts
    legacyHeaders: false,
})
