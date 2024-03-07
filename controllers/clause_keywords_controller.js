import db from '../config/database.js'
import { response_data } from '../config/config.js'

export const Get_keywords = (req,res,next)=>{
    const search = req.query.search
    if(search){
        const query = `SELECT * FROM clause_keywords WHERE keyword LIKE "%${search}%" `
        db.query(query,[search],(err,result)=>{
            if(err){
                next(err)
            }else{
                response_data.data = result
                response_data.message = 'clause keyword by search'
                response_data.status =true
                response_data.access_token=''
                res.json(response_data)
            }
        })
    }else{
        const query = `SELECT * FROM clause_keywords  `
        db.query(query,[search],(err,result)=>{
            if(err){
                next(err)
            }else{
                response_data.data = result
                response_data.message = 'clause keyword'
                response_data.status =true
                response_data.access_token=''
                res.json(response_data)

            }
        })
    }
}
export const Get_keyword_by_Id = (req,res,next)=>{
    const id = req.query.id
    const query = `SELECT * FROM clause_keywords WHERE id IN (${id})  `
    db.query(query,[id],(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message = 'clause keyword by id'
            response_data.status =true
            response_data.access_token=''
            res.json(response_data)
        }
    })
}

export const Add_keyword = (req,res,next)=>{
    const keyword = req.body.keyword.toLowerCase()
    const inactive_keywords = req.body.inactive_keywords
    let query1 = `SELECT * FROM clause_keywords WHERE keyword= ?`
    db.query(query1,[keyword],(err,result)=>{
            if(err){
                next(err)
            }else{
                if(result.length>0){
                    response_data.access_token = ''
                    response_data.data = ''
                    response_data.message = 'Keyword already exists'
                    response_data.status = false
                    res.json(response_data)
                }else{
                    const query = "INSERT INTO clause_keywords (`keyword`,`inactive_keywords`) VALUES (?,?)"
                    db.query(query,[keyword,inactive_keywords],(err,result)=>{
                        if(err){
                            next(err)
                        }else{
                            response_data.access_token = ''
                            response_data.data = ''
                            response_data.message = 'Keyword added Successfully'
                            response_data.status = true
                            res.json(response_data)
                        }
                    })
                }
            }
    })

}
export const Update_keyword = (req,res,next)=>{
    const id = req.params.id
    const keyword = req.body.keyword
    const inactive_keywords = req.body.inactive_keywords

    const query = "UPDATE clause_keywords SET keyword=?,inactive_keywords=? WHERE id = ?"
    db.query(query,[keyword,inactive_keywords,id],(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = []
            response_data.access_token = ''
            response_data.message = 'Keyword updated Successfully'
            response_data.status = true
            res.json(response_data)
        }
    })
}

export const Get_Clause_keywordCombinations_by_id = (req,res,next)=>{
    const clause_id = req.query.clause_id
    const clause_alt_id = req.query.clause_alt_id
    const category = req.query.category
    const query = 'SELECT * FROM public_clause_keyword_combinations WHERE clause_id = ? AND clause_alt_id = ? AND category=?'
    db.query(query,[clause_id,clause_alt_id,category],(err,result)=>{
      if(err){
        next(err)
      }else{
        response_data.data = result[0]?result[0]:[]
        response_data.message = 'Clause Alternates Keyword Combinations'
        response_data.status = true
        res.json(response_data)
      }
})
}
export const Add_Clause_keywordCombinations_by_id = (req,res,next)=>{
    const clause_id = req.body.clause_id
    const clause_alt_id = req.body.clause_alt_id
    const category = req.body.category
    const keyword_combinations = JSON.stringify(req.body.keyword_combinations)
    const query = "INSERT INTO public_clause_keyword_combinations (`clause_id`, `clause_alt_id`, `category`, `keyword_combinations`) VALUES (?, ?, ?, ?)";
    db.query(query,[clause_id,clause_alt_id,category,keyword_combinations],(err,result)=>{
      if(err){
        console.log(err);
        next(err)
      }else{
        let query1 = 'SELECT * FROM public_clause_keyword_combinations WHERE id = ? '
        db.query(query1,[result.insertId],(err,res2)=>{
            if(err){
                next(err)
            }else{
                response_data.data = res2[0]
                response_data.access_token = ''
                response_data.message = ''
                response_data.status = true
                res.json(response_data)
            }
        })

      }
})
}
export const Update_Clause_keywordCombinations_by_id = (req,res,next)=>{
    const id = req.body.id
    const clause_id = req.body.clause_id
    const clause_alt_id = req.body.clause_alt_id
    const category = req.body.category
    const keyword_combinations = JSON.stringify(req.body.keyword_combinations)
    const query = "UPDATE public_clause_keyword_combinations SET clause_id=?, clause_alt_id=?, category=?, keyword_combinations=? WHERE id = ?";

    db.query(query,[clause_id,clause_alt_id,category,keyword_combinations,id],(err,result)=>{
      if(err){
        console.log(err);
        next(err)
      }else{
        let query1 = 'SELECT * FROM public_clause_keyword_combinations WHERE id = ? '
        db.query(query1,[id],(err,res2)=>{
            if(err){
                next(err)
            }else{
                response_data.data = res2[0]
                response_data.access_token = ''
                response_data.status = true
                res.json(response_data)
            }
        })

      }
})
}
