import express from 'express'
import {Signup,Login,Employee_verification, Non_userAccess} from '../controllers/auth_controller.js'
import {GetPermissions_by_roleId} from '../controllers/permissions_controller.js'
import { verifyToken } from "../middleware/verify.mjs"

const router = express.Router()

router.post('/signup',Signup)
router.post('/login',Login)
// router.get('/non_user_auth',Non_userAccess)
router.post('/verification',Employee_verification)
router.get('/permissions',GetPermissions_by_roleId)

export default router