import express from 'express'
import AuthGuards from '../../guards/AuthGuards'
import GuestGuards from '../../guards/GuestGuard'
import { ThrottleGaurds } from '../../guards/ThrottleGuards'
import { AUTH } from './auth.controller'
const router = express.Router()

// MODE ONE
router.get('/me', AuthGuards, AUTH.me)
router.post('/sign-up', GuestGuards, AUTH.register)
router.post('/sign-in', ThrottleGaurds, GuestGuards, AUTH.login)
router.get('/logout', AuthGuards, AUTH.logout)

// Export the router
const AuthRoutes = router
export default AuthRoutes
