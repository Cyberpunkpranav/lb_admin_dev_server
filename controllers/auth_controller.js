import db from '../config/database.js'
import { response_data } from '../config/config.js'

export const Signup  = (req,res,next)=>{
const email_id = req.body.email_id
const employee_id = req.body.employee_id
const designation = req.body.designation
const role = req.body.role
const query = 'INSERT into private_users (`employee_id` , `designation` ,`role` , `email_id`) VALUES (?,?,?,?)'
    if(email_id&&designation&&role){    
    db.query(query,[employee_id,designation,role,email_id],(err,result)=>{
        if(err){
        next(err)
        }else{
            response_data.access_token = ''
            response_data.data = []
            response_data.message = 'Details accepted ! you will recieve an e-mail when you are verified'
            response_data.status = true
            res.json(response_data)
        }
    })
    }else{
        response_data.access_token = ''
        response_data.data = ''
        response_data.message = 'Fill all the details to complete the signup'
        response_data.status = true
        res.json(response_data)
    }
}
export const Employee_verification = (req,res,next)=>{
const is_verified = req.body.is_verified
const query =  'UPDATE private_users SET is_verified=?'
db.query(query,[is_verified],(err,result)=>{
    if(err){
        next(err)
    }else{
        response_data.access_token = ''
        response_data.data = ''
        response_data.message = 'Employee verified successfully'
        response_data.status = true
        res.json(response_data)
    }
})
}
export const Login = (req,res,next)=>{

}