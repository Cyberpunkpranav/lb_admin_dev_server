import db from '../config/database.js'
import { response_data } from '../config/config.js'


export const Get_Colors = (req,res,next)=>{
    const query = 'SELECT * FROM color_palette'
    db.query(query,(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message = 'Colors list'
            response_data.status = true
            response_data.access_token = ''
            res.json(response_data)
        }
    })
}