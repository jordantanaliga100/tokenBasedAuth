import express from 'express'
import AuthGuards from '../../guards/AuthGuard'
import { RolesGuard } from '../../guards/RolesGuard'
import { VerifyGuard } from '../../guards/VerifyGuard'
import { USERS } from './user.controller'

const router = express.Router()

// Eto lang muna, para sa profile view later on
router.get('/', AuthGuards, VerifyGuard, RolesGuard('admin', 'moderator'), USERS.getAllUsers)

const UsersRoutes = router
export default UsersRoutes
