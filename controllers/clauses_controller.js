import db from '../config/database.js'
import axios from 'axios'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import {response_data} from '../config/config.js'
import {PutObject, GetObjects} from '../middleware/S3_bucket.mjs'

const currentDir = dirname(fileURLToPath(import.meta.url));

export const Create_clause = async(req,res,next)=>{
  const token = req.headers.authorization;

  const query = 'INSERT into public_clauses (`clause_name`,`definition`,`rationale`) VALUES (?,?,?)'
  db.query(query,[req.body.clause_name,req.body.definition,req.body.rationale],((err,result)=>{

    if(err){
      next(err)
    }else{
      response_data.access_token=''
      response_data.data={id:result.insertId}
      response_data.message='Clause Created Succesfully'
      response_data.status = true
      res.json(response_data)
    }
  }))
}
export const Get_Clauses = (req,res,next)=>{
    const limit = Number(req.query.limit)
    const offset = Number(req.query.offset)
    const user_id = Number (req.query.user_id)
    let query;
    if(req.query.search !=undefined){
     query = `SELECT * from public_clauses WHERE clause_name LIKE "%${req.query.search}%" ORDER BY clause_name LIMIT ? OFFSET ? `
     db.query(query,[limit,offset],((err,result)=>{
        if(err){
            res.json(err)
        }else{
            response_data.data = result
            response_data.message = 'Clauses list'
            response_data.status = true
            res.json(response_data)
        }
    }))
    }else{
        query = `SELECT * from public_clauses ORDER BY clause_name LIMIT ? OFFSET ? `
        db.query(query,[limit,offset],((err,result)=>{
            if(err){
                next(err)
            }else{
                response_data.data = result
                response_data.message = 'Clauses list'
                response_data.status = true
                res.json(response_data)
            }
        }))
    }

}
export const Get_Clause_by_Id = async (req,res,next)=>{
        const id = Number(req.query.id)
        const query = `SELECT * FROM public_clauses WHERE id = ?`
          db.query(query,[id],((err,result)=>{
            if(err){
              next(err)
            }else{
              response_data.data = result[0]
              response_data.status = true
              response_data.message = 'clause by id'
              response_data.access_token = ''
              res.json(response_data)
              }
    }))
}
export const Get_clause_alt_by_id=(req,res,next)=>{
  const clause_id = Number(req.query.clause_id)
      let query = `SELECT * FROM public_clause_alternates WHERE clause_id=?`
       db.query(query,[clause_id],(async(err,result)=>{
           if(err){ 
              next(err)
           }else{
            response_data.data = result
            response_data.access_token = ''
            response_data.message = 'Clause Alternate'
            response_data.status = true
             res.json(response_data)
           }
       }))

}
export const Get_clause_alt_ctgry_by_id=(req,res,next)=>{
  const clause_id = Number(req.query.clause_id)
  const clause_alt_id = req.query.clause_alt_id
  if(clause_id!=='undefined'&&clause_alt_id!=='undefined'&&clause_alt_id!==undefined){ 
      let query = `SELECT * FROM public_clause_alternate_category WHERE clause_id=? AND clause_alt_id = ?`
       db.query(query,[clause_id,clause_alt_id],(async(err,result)=>{
           if(err){ 
              next(err)
           }else{
            // for(let i=0;i<result.length;i++){
            //   if(result[i].file !==undefined && result[i].file !==null){
            //    let S3_URL = await GetObjects(`assets/clauses/${result[i].file}`)
            //    let HTML = await axios.get(S3_URL)
            //    result[i].html = HTML.data? HTML.data:''
            //    }
            // }
            response_data.data = result
            response_data.access_token = ''
            response_data.message = 'Clause Alternate Category'
            response_data.status = true
            res.json(response_data)
           }
       }))
  }else{
    response_data.data = []
    response_data.message = 'please choose clause_alt_id and clause_id'
    response_data.status = false
    response_data.access_token=false
    res.json(response_data)
  }
}
export const Update_Clause = async (req,res,next) => {
    const Id = Number(req.body.id);
    const clause_name = req.body.clause_name;
    const definition = req.body.definition;
    const clause_rationale = req.body.rationale
    const keywords = JSON.stringify(req.body.keywords)
    const keyword_combinations = JSON.stringify(req.body.keyword_combinations)

    try {
      let query = 'UPDATE public_clauses SET clause_name = ?, definition = ?,rationale =?,keywords=?,keyword_combinations=? WHERE id = ?';
       db.query(query, [clause_name, definition,clause_rationale,keywords,keyword_combinations, Id]);
      response_data.data = ''
      response_data.status = true
      response_data.access_token = ''
      response_data.message =  'Keyword combinations and Clauses updated sucessfully'
      res.json(response_data);
    } catch (err) {
    next(err);
    }
}  
export const Update_Clause_Alternate=(req,res,next) =>{
     const id = req.body.id
     const clause_id = req.body.clause_id
     const rationale = req.body.rationale
     const nature = req.body.nature
     const explaination = req.body.explaination
     const status = req.body.status
     let query ='UPDATE public_clause_alternates SET clause_id = ?, rationale=?,nature=?,explaination=?,status = ? WHERE id = ?';
     db.query(query, [clause_id,rationale,nature,explaination, status, id],((err,result)=>{
        if(err){
           next(err)
        }else{   
           response_data.data = []
           response_data.access_token = ''
           response_data.status = true
           response_data.message = `${nature} Saved successfully`
           res.json(response_data)
        }
    }))
}
export const Update_Clause_Alternate_Category=(req,res,next) =>{
  const queries = req.body.map(async (item) => {
    if(item.id==''||item.id==undefined||item.id.length==0){
      return new Promise((resolve,reject)=>{
      let query = `INSERT INTO public_clause_alternate_category (clause_id,clause_alt_id,category,html,keyword) VALUES (?, ?, ?, ?, ?)`
      db.query(query,[item.clause_id,item.clause_alt_id,item.category,item.html,item.keyword],(err,result)=>{
        if(err){
          next(err)
        }else{
          resolve(`sample clause added successfully`);
        }
      })
    })
    }else{
      return new Promise((resolve,reject)=>{
     let query =`UPDATE public_clause_alternate_category SET clause_id = ? , clause_alt_id = ?, category=?, html=?, keyword=? WHERE id = ?`;
     db.query(query,[item.clause_id,item.clause_alt_id,item.category,item.html,item.keyword,item.id],(err,result)=>{
      if(err){
        next(err)
      }else{
        resolve(`sample clause updated successfully`);
      }
    })
    }
  )}
  })
  Promise.all(queries)
  .then((successMessages) => {
    response_data.data = []
    response_data.message ='clauses updated and saved successfully'
    response_data.status = true
    res.json(response_data);
  })
  .catch((err) => {
    next(err);
  });

}
export const Add_Clause_alternates  = async(req,res,next)=>{
    const clause_id = req.body.clause_id;
    const rationale =  req.body.rationale
    const nature = req.body.nature
    const explaination = req.body.explaination
    const status = req.body.status;

    let query ='INSERT into public_clause_alternates (`clause_id`,`rationale`,`nature`,`explaination`,`status`) VALUES (?,?,?,?,?)';
    db.query(query, [clause_id,rationale,nature,explaination, status],((err,result)=>{
       if(err){
           next(err)
       }else{  
        let query = 'SELECT * FROM public_clause_alternates WHERE id=? '
        db.query(query,[result.insertId],(err,res2)=>{
          if(err){
            next(err)
          }else{
            response_data.data = res2[0]
            response_data.access_token = ''
            response_data.status = true
            response_data.message = `"${nature}" clause added successfully`
            res.json(response_data)
          }
        })
        let obj_simple = {
          clause_id: clause_id,
          clause_alt_id:result.insertId,
          category:'simple',
          html:'',
          keyword:''
        }
        let query1 = 'INSERT into public_clause_alternate_category (`clause_id`,`clause_alt_id`,`category`,`html`,`keyword`) VALUES (?,?,?,?,?) '
        db.query(query1,[obj_simple.clause_id,obj_simple.clause_alt_id,obj_simple.category,obj_simple.html,obj_simple.keyword],()=>{
          let obj_moderate = {
            clause_id: clause_id,
            clause_alt_id:result.insertId,
            category:'moderate',
            html:'',
            keyword:''
          }
          db.query(query1,[obj_moderate.clause_id,obj_moderate.clause_alt_id,obj_moderate.category,obj_moderate.html,obj_moderate.keyword],()=>{
            let obj_complex = {
              clause_id: clause_id,
              clause_alt_id:result.insertId,
              category:'complex',
              html:'',
              keyword:''
            }
            db.query(query1,[obj_complex.clause_id,obj_complex.clause_alt_id,obj_complex.category,obj_complex.html,obj_complex.keyword])
          })
        })


       }
   }))
}
export const Switch_Clause_alternate = async(req,res,next)=>{
  const status = req.body.status
  const id = req.body.id
  const query = 'Update public_clause_alternates SET status = ? WHERE id = ?'
  db.query(query,[status,id],(err,result)=>{
    if(err){
      next(err)
    }else{
      response_data.access_token = ''
      response_data.data = []
      response_data.status = true
      response_data.message = 'clause alternate status changed successfully'
      res.json(response_data)
    }
  })
}
export const Delete_Clause_alternate = async(req,res,next)=>{
  const id = req.query.id
  const query = 'Delete FROM public_clause_alternates WHERE id = ?'
  db.query(query,[id],(err,result)=>{
    if(err){
      next(err)
    }else{
      response_data.access_token = ''
      response_data.data = []
      response_data.status = true
      response_data.message = 'clause alternate deleted successfully'
      res.json(response_data)
    }
  })
}
export const Clause_total = (req,res,next)=>{
const query = 'SELECT COUNT(*) AS total_count FROM public_clauses;'
db.query(query,(err,result)=>{
  if(err){
    next(err)
  }else{
    response_data.message='clause total count'
    response_data.status=true
    response_data.data = result[0].total_count
    res.json(response_data)
  }
})
}