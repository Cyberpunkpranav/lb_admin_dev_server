import {Get_keywords,Get_keyword_by_Id,Add_keyword,Update_keyword,Get_Clause_keywordCombinations_by_id,Add_Clause_keywordCombinations_by_id,Update_Clause_keywordCombinations_by_id} from '../controllers/clause_keywords_controller.js'
import express from 'express'
import { verifyToken } from "../middleware/verify.mjs";

const router = express.Router()

router.get('/clause/keywords/list',verifyToken,Get_keywords)
router.get('/clause/keyword/id',verifyToken,Get_keyword_by_Id)
router.post('/clause/keyword/add',Add_keyword)
router.put('/clause/keyword/update/:id',verifyToken,Update_keyword)
router.get('/clause/clause_alternates/keyword_combinations',verifyToken,Get_Clause_keywordCombinations_by_id)
router.post('/clause/clause_alternates/keyword_combinations/add',verifyToken,Add_Clause_keywordCombinations_by_id)
router.post('/clause/clause_alternates/keyword_combinations/update',verifyToken,Update_Clause_keywordCombinations_by_id)

export default router