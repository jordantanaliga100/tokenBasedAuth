import express from 'express'
import { default as AuthGuard } from '../../guards/AuthGuard'
import GuestGuard from '../../guards/GuestGuard'
import { ThrottleGaurd } from '../../guards/ThrottleGuard'
import { AUTH } from './auth.controller'
const router = express.Router()

// MODE ONE

router.get('/me', AuthGuard, AUTH.me)
router.post('/sign-up', GuestGuard, AUTH.register)
router.post('/sign-in', ThrottleGaurd, GuestGuard, AUTH.login)
router.get('/logout', AuthGuard, AUTH.logout)

router.post('/request-verification', AuthGuard, ThrottleGaurd, AUTH.requestVerification)
router.post('/verify-email', AUTH.verifyEmail)

router.post('/forgot-password', AUTH.sendPasswordReset)
router.post('/reset-password', AUTH.resetPassword)

// Export the router
const AuthRoutes = router
export default AuthRoutes
