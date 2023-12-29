import express from 'express'
import {Signup,Login,Employee_verification} from '../controllers/auth_controller.js'
import { verifyToken } from "../middleware/verify.mjs"

const router = express.Router()

router.post('/signup',Signup)
router.post('/login',Login)
router.post('/verification',Employee_verification)

export default router