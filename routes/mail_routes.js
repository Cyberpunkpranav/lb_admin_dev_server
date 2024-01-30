import { Send_Welcome_Email } from "../controllers/mail_controller.js";
import express from 'express'
const router = express.Router()

router.post('/mail/dpo',Send_Welcome_Email)

export default router