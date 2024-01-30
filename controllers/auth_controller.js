import db from '../config/database.js'
import { response_data } from '../config/config.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const Signup  = (req,res,next)=>{
const email_id = req.body.email_id
const employee_id = req.body.employee_id
const designation = req.body.designation
const username = req.body.username
const password = req.body.password
const is_verified = 0
//hashing password
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashed_password = bcrypt.hashSync(password, salt);
const query = 'INSERT into admin_users (`username`,`employee_id` , `designation` , `email_id`,`password`,`is_verified`) VALUES (?,?,?,?,?,?)'

    if(username&&email_id){    
    db.query(query,[username,employee_id,designation,email_id,hashed_password,is_verified],(err,result)=>{
        if(err){
        next(err)
        }else{
            response_data.access_token = ''
            response_data.data = []
            response_data.message = 'Details accepted! Please Login after sometime to access panel'
            response_data.status = true
            res.json(response_data)
        }
    })
    }else{
        response_data.access_token = ''
        response_data.data = ''
        response_data.message = 'Fill all the details to complete the signup'
        response_data.status = false
        res.json(response_data)
    }
}
export const Employee_verification = (req,res,next)=>{
const is_verified = req.body.is_verified
const query =  'UPDATE admin_users SET is_verified=?'
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

export const Login = async (req,res)=>{
    // creating token
    const payload = {
      username:req.body.username,
      password:req.body.password
    }
  const access_token  = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
  const q = 'SELECT * FROM admin_users WHERE email_id = ?'
   db.query(q,[req.body.username,req.body.username],(err,result)=>{
    if(err){
      res.json(err)
    }else{
      if(result.length>0){
        const pass = bcrypt.compareSync(req.body.password, result[0].password)
        if(pass == true){
          response_data.status = true
          response_data.data = result[0]
          response_data.message = "Welcome"+' '+ result[0].username
          response_data.access_token=access_token
         res.json(response_data)
        }else{
            response_data.message='username or passward is not valid'
            response_data.data = []
            response_data.status = false
            response_data.access_token=access_token
            res.json(response_data)
        }
      }else{
        response_data.message='username or email not found'
        response_data.data = []
        response_data.status = false
      res.json(response_data)
      }

    }
  })
 }

 export const Non_userAccess= async(req,res,next)=>{
  var clientIPaddr = null,
  clientProxy = null;
  if (req.headers['via']) { // yes
    clientIPaddr = req.headers['x-forwarded-for'];
    clientProxy = req.headers['via'];
} else { // no
    clientIPaddr = req.connection.remoteAddress;
    clientProxy = "none";
}
let payload = {
  username :''
}
if(clientIPaddr == '::1'){
  payload = {
    username :'127.0.0.1'
  }
}else{
  payload = {
    username :clientIPaddr
  }
}
const access_token  = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
response_data.access_token = access_token
response_data.message = 'access granted'
response_data.status = 0

res.json(response_data)
}