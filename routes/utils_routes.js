import {Get_Colors} from '../controllers/utils_controller.js'
import express from 'express'
import { verifyToken } from "../middleware/verify.mjs";

const router = express.Router()

router.get('/keywords/list',verifyToken,Get_Colors)


export default router