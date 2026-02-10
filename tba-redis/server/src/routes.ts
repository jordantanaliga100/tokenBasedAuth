import { Router } from 'express'
import AuthRoutes from './app/auth/auth.route'
import UsersRoutes from './app/users/user.routes'

interface Route {
    path: string
    router: Router
}
const ApiRoutes: Route[] = [
    { path: 'auth', router: AuthRoutes },
    { path: 'users', router: UsersRoutes },
]

export default ApiRoutes
