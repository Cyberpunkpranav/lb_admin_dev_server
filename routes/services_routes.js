import { 
Get_Clauses,
Get_Clause_by_Id,
Get_clause_alt_by_id,
Get_clause_alt_ctgry_by_id,
Update_Clause,Add_Clause_alternates,
Create_clause,Switch_Clause_alternate,
Delete_Clause_alternate,Clause_total,
Update_Clause_Alternate,
Update_Clause_Alternate_Category } from "../controllers/clauses_controller.js";
import express from 'express'
import { verifyToken } from "../middleware/verify.mjs";

const router = express.Router()

router.get('/libraries/clauses',verifyToken,Get_Clauses)
router.get('/libraries/clause_count',verifyToken,Clause_total)
router.get('/libraries/clause/view',verifyToken,Get_Clause_by_Id)
router.get('/libraries/clause/clause_alt/view',verifyToken,Get_clause_alt_by_id)
router.get('/libraries/clause/clause_alt/category/view',verifyToken,Get_clause_alt_ctgry_by_id)
router.post('/libraries/clauses/update',verifyToken,Update_Clause)
router.post('/libraries/clauses/clause_alternates/update',verifyToken,Update_Clause_Alternate)
router.post('/libraries/clauses/clause_alternates/clause_alternate_category/update',Update_Clause_Alternate_Category)
router.post('/libraries/clause/alternate/new',verifyToken,Add_Clause_alternates)
router.post('/libraries/clauses/create',verifyToken,Create_clause)
router.post('/libraries/clauses/alternate/switch',Switch_Clause_alternate)
router.delete('/libraries/clauses/alternate/delete',Delete_Clause_alternate)



export default router