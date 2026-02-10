export interface User {
    id: string
    username: string
    email: string
    password: string // sensitive
    created_at: Date
    updated_at: Date
}
export type SafeUserDTO = Omit<User, 'password'>
