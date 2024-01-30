import db from '../config/database.js'
import { response_data } from '../config/config.js'

export const GetPermissions_by_roleId = (req,res,next)=>{
    const role_id = req.query.role_id
    const query = 'SELECT * FROM permissions WHERE role_id = ?'
    db.query(query,[role_id],(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result[0]
            response_data.message = 'permissions'
            response_data.status = true
            res.json(response_data)
        }
    })
}