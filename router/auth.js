import express from 'express';

//controller
import { signup, login, verifyEmail, resetPassword, create, forgetPassword } from '../controller/users';

//middleware
import adminAuth from '../middleware/adminAuth';

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.get('/verifyEmail', verifyEmail)
router.post('/resetPassword', resetPassword)
router.post('/forgetPassword', forgetPassword)
router.post('/create', adminAuth, create)

export default router