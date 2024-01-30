import db from '../config/database.js'
import { response_data } from '../config/config.js'
import bcrypt from 'bcrypt'

export const Websites_list = (req,res,next)=>{
    const query = 'SELECT * FROM websites '
    db.query(query,(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message =  'websites list'
            response_data.status = true
            res.json(response_data)
        }
    })
}
export const Websites_list_by_Id = (req,res,next)=>{
    const id = req.query.ids
    const query = `SELECT * FROM websites WHERE id IN (${id}) `
    db.query(query,(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message =  'websites list'
            response_data.status = true
            res.json(response_data)
        }
    })
}
export const Get_roles = (req,res,next)=>{
const query = 'SELECT * FROM user_roles'
 db.query(query,(err,result)=>{
    if(err){
        next(err)
    }else{
        response_data.data = result
        response_data.message = 'roles list'
        response_data.status = true
        response_data.access_token = ''
        res.json(response_data)
    }
})
}
export const Get_Role_by_Id= async(req,res,next)=>{
    const id = req.query.id
    const query = 'SELECT * FROM user_roles WHERE id = ?'
    db.query(query,[id],(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result[0]
            response_data.message = 'role by id'
            response_data.status = true
            response_data.access_token = ''
            res.json(response_data)
        }
    })
}

export const Get_role_by_Id = async(id,next)=>{
    return new Promise((resolve, reject) => {
const query = 'SELECT * FROM user_roles WHERE id = ?'
 db.query(query,[id],(err,result)=>{
    if(err){
        next(err)
    }else{
        resolve(result[0])
    }
})
})
}

export const AdminUsers_list =(req,res,next)=>{
    const role_id = req.query.role_id
    const senior_user_id = req.query.senior_user_id

    if(senior_user_id!=1){
        const query = 'SELECT * FROM admin_users WHERE senior_user_id = ?'
        db.query(query,[senior_user_id],(async(err,result)=>{
            if(err){
                next(err)
            }else{
                for (let i=0;i<result.length;i++){
                    const role_info = await Get_role_by_Id(result[i].role_id)
                    result[i].user_role = role_info
                }
                response_data.data = result
                response_data.message = 'users'
                response_data.status = true
                response_data.access_token = ''
                res.json(response_data)
            }
        }))
    }else{
        const query = 'SELECT * FROM admin_users'
        db.query(query,(async(err,result)=>{
            if(err){
                next(err)
            }else{
                for (let i=0;i<result.length;i++){
                    const role_info = await Get_role_by_Id(result[i].role_id)
                    result[i].user_role = role_info
                }
                response_data.data = result
                response_data.message = 'admin users list'
                response_data.status = true
                response_data.access_token = ''
                res.json(response_data)
            }
        }))   
    }

}
export const AdminUser_by_RoleId =(req,res,next)=>{
    const role_id= req.params.role_id
    const query = 'SELECT * FROM admin_users WHERE role_id = ? '
    db.query(query,[role_id],((err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message = 'admin user by role id'
            response_data.status = true
            response_data.access_token = ''
            res.json(response_data)
        }
    }))
}

export const AdminUser_by_Id =(req,res,next)=>{
    const id =  req.params.id
    const role_id= req.query.role_id
    const query = 'SELECT * FROM admin_users WHERE id = ? '
    db.query(query,[id],(async(err,result)=>{
        if(err){
            next(err)
        }else{
            result[0].user_role = await Get_role_by_Id(result[0].role_id)
            // result[0].assign_seniors = Get_seniors_by_roleid(role_id)
            response_data.data = result[0]
            response_data.message = 'admin user'
            response_data.status = true
            response_data.access_token = ''
            res.json(response_data)
        }
    }))
}

export const Update_AdminUser  = (req,res,next)=>{
    const id = req.params.id
    const email_id = req.body.email_id
    const employee_id = req.body.employee_id
    const designation = req.body.designation
    const username = req.body.username
    const password = req.body.password
    const resetpassword = req.body.resetpassword
    const role_id = req.body.role_id
    const senior_user_id = req.body.senior_user_id
    const is_verified = req.body.is_verified
    let reserverdpass = password
    //hashing password
    if(resetpassword){
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashed_password = bcrypt.hashSync(resetpassword, salt);
        reserverdpass = hashed_password
    }
    const query = 'UPDATE admin_users SET username=?,employee_id=?,designation=?,role_id=?,senior_user_id=?,email_id=?,password=?,is_verified=? WHERE id=?'
      
        db.query(query,[username,employee_id,designation,role_id,senior_user_id,email_id,reserverdpass,is_verified,id],(err,result)=>{
            if(err){
            next(err)
            }else{
                response_data.access_token = ''
                response_data.data = []
                response_data.message = 'Details updated successfully'
                response_data.status = true
                res.json(response_data)
            }
        })
    }

export const Get_Permissions_By_Role = (req,res,next)=>{
    const role_id = req.query.role_id
    const query = 'SELECT * FROM permissions WHERE role_id = ?'
    db.query(query,[role_id],(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result[0]
            response_data.message = 'permission by role_id'
            response_data.status = true
            response_data.access_token = ''
            res.json(response_data)
        }
    })
} 
export const Get_Permissions= (req,res,next)=>{
    const query = 'SELECT * FROM permissions '
    db.query(query,(err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message = 'permissions list'
            response_data.status = true
            response_data.access_token = ''
            res.json(response_data)
        }
    })
}