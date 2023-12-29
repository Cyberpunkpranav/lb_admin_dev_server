import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import Admin_Auth from './routes/auth_routes.js'
import Admin_Sections_routes from './routes/sections_routes.js'
import Admin_Chapters_routes from './routes/chapters_routes.js'
import Admin_Acts_routes from './routes/act_routes.js'
import Admin_Services_routes from './routes/services_routes.js'
import Admin_Blogs_routes from './routes/blog_routes.js'
import Error_handler  from './middleware/error_handler.mjs'
const app = express()
const __filename = new URL(import.meta.url).pathname;

// const image_path = path.join('..','assets','blog_images')
// app.use('/clauses', express.static(path.join(__dirname, 'assets','clauses')));
// app.use('/uploads', express.static('assets/blog_images'))
// app.use('/clauses', express.static('assets/clauses'));
// app.use('/uploads',express.static('E:/Aartas Tech/Pranav Sharma/legal_buddy/back_end/assets/blog_images'))
// console.log(path.join(__dirname, 'assets','blog_images'));
app.use(cors())
app.use(cors({ origin: '*' }));
dotenv.config() 
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));

app.use('/api/admin/auth',Admin_Auth)
app.use('/api/admin/acts_and_rules',Admin_Acts_routes)
app.use('/api/admin/acts_and_rules/acts',Admin_Chapters_routes)
app.use('/api/admin/acts_and_rules/acts',Admin_Sections_routes)
app.use('/api/admin/blogs',Admin_Blogs_routes)
app.use('/api/admin/services',Admin_Services_routes)

app.use(Error_handler)

app.listen(process.env.PORT,(()=>{
        console.log(`listening to port at ${process.env.PORT}`)
}))
app.get('/',(req,res)=>{
        res.send(`<h1>server is listening on port ${process.env.PORT}</h1>`)
})