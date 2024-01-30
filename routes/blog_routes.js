import express from 'express'
import multer from 'multer'
import {Insert_Blog,Get_Blogs,Get_Blogs_By_Senior,Delete_Blogs,Blogs_Filters,Update_Blog,Blog_by_Id,Switch_Blogs,Blog_total} from '../controllers/blogs_controller.js'
import { verifyToken } from '../middleware/verify.mjs'

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/new',verifyToken,upload.single('image'),Insert_Blog)
router.get('/allblogs',verifyToken,Get_Blogs)
router.get('/allblogs/admin',verifyToken,Get_Blogs_By_Senior)
router.delete('/delete',verifyToken,Delete_Blogs)
router.get('/types',verifyToken,Blogs_Filters)
router.put('/update/:id',verifyToken,upload.single('image'),Update_Blog)
router.get('/blogbyId',verifyToken,Blog_by_Id)
router.post('/switch',verifyToken,Switch_Blogs)
router.get('/blog_count',verifyToken,Blog_total)

export default router