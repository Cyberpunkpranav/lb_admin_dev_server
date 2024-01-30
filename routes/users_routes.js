import { AdminUsers_list,AdminUser_by_Id,Update_AdminUser,Websites_list,Websites_list_by_Id,AdminUser_by_RoleId,Get_roles,Get_Role_by_Id,Get_Permissions_By_Role,Get_Permissions} from "../controllers/users_controller.js"
import express from 'express'
import { verifyToken } from "../middleware/verify.mjs"

const router = express.Router()

router.get('/admin_users/roles/list',verifyToken,Get_roles)
router.get('/admin_users/role/id',verifyToken,Get_Role_by_Id)

router.get('/admin_users/list',verifyToken,AdminUsers_list)
router.get('/admin_users/id/:id',verifyToken,AdminUser_by_Id)
router.get('/admin_users/role/:role_id',verifyToken,AdminUser_by_RoleId)
router.put('/admin_users/user/update/:id',verifyToken,Update_AdminUser)
//website list
router.get('/admin_users/websites/list',verifyToken,Websites_list)
router.get('/admin_users/websites/id',verifyToken,Websites_list_by_Id)

//permissions
router.get('/admin_users/permissions/role_id',verifyToken,Get_Permissions_By_Role)
router.get('/admin_users/permissions/list',verifyToken,Get_Permissions)


export default router
