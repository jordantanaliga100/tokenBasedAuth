export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator',
}

export interface User {
    id: string
    username: string
    email: string
    password: string
    role: UserRole // Protektado na tayo dito
}
