 import db from '../config/database.js'
 import {BlogsType_response_data, response_data} from '../config/config.js'
 import {PutObject, GetObjects} from '../middleware/S3_bucket.mjs'


 export const Insert_Blog = (req,res,next)=>{
  const image =`image-${Date.now()}${req.file.originalname}`
   async function Upload_in_s3(){
   await PutObject(`assets/blog_images/${image}`,req.file.buffer)
  }
    if (req.file !== undefined) {
      Upload_in_s3()
    }
    const query = 'INSERT INTO blogs (`title`,`user_id`,`senior_user_id`, `description`, `content`,`image`,`topic_id`,`category_id`,`industry_id`,`status`) VALUES (?,?,?,?,?,?,?,?,?,?)'
    db.query(query,[req.body.title,req.body.user_id,req.body.senior_user_id,req.body.description,req.body.content,image,req.body.topic_id,req.body.category_id,req.body.industry_id,req.body.status],(err,result)=>{
      if(err){ 
        next(err)
      }else{
        response_data.data = ''
        response_data.message = 'New Blog Added Successfully'
        response_data.status = true
        res.json(response_data) 
      } 
    })
} 
export const Get_Blogs_By_Senior = (req,res,next)=>{
  let query = ''
  const limit = Number(req.query.limit)
  const offset = Number(req.query.offset)
  const senior_user_id = Number(req.query.senior_user_id)

  if(req.query.search!==undefined &&req.query.search.length>0){
    query = `SELECT * FROM blogs WHERE title LIKE "%${req.query.search}%" OR description LIKE "%${req.query.search}%" OR content LIKE "%${req.query.search}%" AND senior_user_id=? ORDER BY id desc LIMIT ? OFFSET ? `
    db.query(query,[senior_user_id,limit,offset,topic_id,category_id,industry_id],(err,result)=>{
      if(err){
        next(err)
      }else{  
        res.json(result)
      }
    })
  }else{
     query = `SELECT * FROM blogs WHERE senior_user_id=? ORDER BY id desc LIMIT ? OFFSET ? `
     db.query(query,[senior_user_id,limit,offset],(err,result)=>{
      if(err){
        next(err)
      }else{  
        res.json(result)
      }
    })
  }

}
export const Get_Blogs = (req,res,next)=>{
  let query = ''
  const limit = Number(req.query.limit)
  const offset = Number(req.query.offset)
  const user_id = Number(req.query.user_id)

  if(user_id==0){
    query = `SELECT * FROM blogs WHERE title LIKE "%${req.query.search}%" OR description LIKE "%${req.query.search}%" OR content LIKE "%${req.query.search}%" LIMIT ? OFFSET ?`
    db.query(query,[limit,offset],(err,result)=>{
      if(err){
        next(err)
      }else{  
        res.json(result)
      }
    })
  }else{
  if(req.query.search!==undefined &&req.query.search.length>0){
    // query = 'SELECT * FROM blogs WHERE title LIKE "%?%" LIMIT ? OFFSET ?'
    query = `SELECT * FROM blogs WHERE title LIKE "%${req.query.search}%" OR description LIKE "%${req.query.search}%" OR content LIKE "%${req.query.search}%" AND user_id=? OR senior_user_id = ? ORDER BY id desc LIMIT ? OFFSET ? `
    db.query(query,[user_id,user_id,limit,offset],(err,result)=>{
      if(err){
        next(err)
      }else{  
        res.json(result)
      }
    })
  }else{
     query = `SELECT * FROM blogs WHERE user_id=? OR senior_user_id = ? ORDER BY id desc LIMIT ? OFFSET ? `
     db.query(query,[user_id,user_id,limit,offset],(err,result)=>{
      if(err){
        next(err)
      }else{  
        res.json(result)
      }
    })
  }
}


}
export const Delete_Blogs = (req,res,next)=>{ 
  const id = Number(req.query.id)
  const token = req.headers.authorization;
//    VerifyToken(token,req,res,next)

  const query = 'DELETE FROM blogs WHERE id = ?'
  db.query(query,[id],(err,result)=>{
    if(err){
      next(err)
    }else{
      response_data.message = 'Blog Deleted Succesfully'
      response_data.data = ''
      response_data.status = true
      res.json(response_data)
    }
  })
}
export const Switch_Blogs=(req,res,next)=>{
  const id = Number(req.body.id)
  const status = Number(req.body.status)
  const token = req.headers.authorization;
//    VerifyToken(token,req,res,next)

  const query = 'UPDATE blogs SET status = ? WHERE id = ?  '
  db.query(query,[status,id],(err,result)=>{
    if(err){
      next(err)
    }else{
      response_data.data = ''
      response_data.message = 'Blog Status Updated Successfully'
      response_data.status = true
      res.json(response_data)
    }
  })
}
const fetch_topics = (next)=>{
 let query = 'SELECT * FROM blog_topics' 
  return new Promise((resolve)=>{
    setTimeout(()=>{
      db.query(query,(err,result)=>{
        if(err){
          next(err)
        }
        else{
         resolve(result.flat()) 
        }
    })
    },1000)

  })
}
const fetch_categories = (next)=>{
  let query = 'SELECT * FROM blog_categories' 
   return new Promise((resolve)=>{
     setTimeout(()=>{
       db.query(query,(err,result)=>{
         if(err){
           next(err)
         }
         else{
          resolve(result.flat()) 
         }
     })
     },1500)
 
   })
 }
 const fetch_industries = (next)=>{
  let query = 'SELECT * FROM blog_industry' 
   return new Promise((resolve)=>{
     setTimeout(()=>{
       db.query(query,(err,result)=>{
         if(err){
           next(err)
         }
         else{
          resolve(result.flat()) 
         }
     })
     },1500)
 
   })
 }
export const Blogs_Filters=async(req,res,next)=>{
  try {
    const [result1, result2, result3] = await Promise.all([
      fetch_topics(next),
      fetch_categories(next),
      fetch_industries(next),
    ]);

    BlogsType_response_data.message = 'Lists'
    BlogsType_response_data.status = true
    BlogsType_response_data.data.topics = result1
    BlogsType_response_data.data.categories = result2
    BlogsType_response_data.data.industry = result3
    res.json(BlogsType_response_data);
  } catch (error) {
    next(error)
  }
}
export const Update_Blog = (req,res,next)=>{
  let image =`image-${Date.now()}${req.file.originalname}`
  const id = req.params.id
  const title = req.body.title
  const description = req.body.description
  const content  = req.body.content
  const topic_id  = Number(req.body.topic_id)
  const category_id = Number(req.body.category_id)
  const industry_id = Number(req.body.industry_id)

  // if(req.file !=undefined){
  //    image = req.file.filename ? req.file.filename:''
  // } 
  async function Upload_in_s3(){
    await PutObject(`assets/blog_images/${image}`,req.file.buffer)
   }
  
  if(req.file == undefined){
    let query = 'UPDATE blogs SET title = ? , description = ? , content = ? ,topic_id = ?,category_id = ? ,industry_id = ? WHERE id = ?'
    try {
      db.query(query,[title,description,content,topic_id,category_id,industry_id,id],(err,result)=>{
        if(err){
          next(err)
        }else{
          response_data.message = 'Blog Updated Succesfully'
          response_data.status = true
          response_data.data = ''
          res.json(response_data)
        }
      })
    } catch (error) {
        next(error)
    }
  }else{

  let query = 'UPDATE blogs SET title = ? , description = ? , content = ?, image = ? ,topic_id = ?,category_id = ? ,industry_id = ? WHERE id = ?'
  try {
    db.query(query,[title,description,content,image,topic_id,category_id,industry_id,id],(err,result)=>{
      if(err){
        next(err)
      }else{
        Upload_in_s3()
        response_data.message = 'Blog Updated Succesfully'
        response_data.status = true
        response_data.data = ''
        res.json(response_data)
      }
    })
  } catch (error) {
      next(error)
  }
}
}
const get_writer = async(user_id,next)=>{
  return new Promise((resolve, reject) => {
    let query1 = `SELECT role_id ,username , designation FROM admin_users WHERE id = ?`
    db.query(query1,[user_id],(err,user_result)=>{
    if(err){
      next(err)
    }else{
      resolve(user_result[0])
    }
   })
  })

}
const get_handler = async(senior_user_id,next)=>{
  return new Promise((resolve, reject) => {
    let query2 = `SELECT role_id ,username , designation FROM admin_users WHERE id = ?`
    db.query(query2,[senior_user_id],(err,senior_user_result)=>{
     if(err){
       next(err)
     }
     resolve(senior_user_result[0])
    })
  })

}
export const Blog_by_Id = (req,res,next)=>{
  const id = Number(req.query.id)

  const query = 'SELECT * FROM blogs WHERE id = ?'
    db.query(query,[id],async(err,result)=>{
      if(err){
        next(err)
      }else{
        if(result[0].image !==undefined && result[0].image !==null){
          result[0].image_url = await GetObjects(`assets/blog_images/${result[0].image}`)
         }
         
         result[0].writer = await get_writer(result[0].user_id,next)
         result[0].handler = await get_handler(result[0].senior_user_id,next)
        response_data.message=''
        response_data.status=true
        response_data.data = result
        res.json(result)
      }
    })

}  
export const Blog_total = (req,res,next)=>{
  const token = req.headers.authorization;
//    VerifyToken(token,req,res,next)
const query = 'SELECT COUNT(*) AS total_count FROM blogs;'
db.query(query,(err,result)=>{
  if(err){
    next(err)
  }else{
    response_data.message='blog total count'
    response_data.status=true
    response_data.data = result[0].total_count
    res.json(response_data)
  }
})
}

