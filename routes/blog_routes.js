import express from 'express'
// import upload from '../middleware/multer_middleware.mjs'
import {Insert_Blog,Get_Blogs,Delete_Blogs,Blogs_Filters,Update_Blog,Blog_by_Id,Switch_Blogs,Blog_total} from '../controllers/blogs_controller.js'
import { verifyToken } from '../middleware/verify.mjs'

const router = express.Router()

//admin
router.post('/new',verifyToken,Insert_Blog)
router.get('/allblogs',verifyToken,Get_Blogs)
router.delete('/delete',verifyToken,Delete_Blogs)
router.get('/types',verifyToken,Blogs_Filters)
router.put('/update/:id',verifyToken,Update_Blog)
router.get('/blogbyId',verifyToken,Blog_by_Id)
router.post('/switch',verifyToken,Switch_Blogs)
router.get('/blog_count',verifyToken,Blog_total)

export default router