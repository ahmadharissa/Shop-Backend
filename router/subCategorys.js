import express from "express";

//controller
import { getSubCategorys, getSubCategory, createSubCategory, editeSubCategory, deleteSubCategory, addToSubCategory, deleteFromSubCategory } from "../controller/sybCategorys"

//middleware
import adminAuth from "../middleware/adminAuth";

const router = express.Router();

router.get('/', getSubCategorys)
router.get('/:id', getSubCategory)
router.post('/', adminAuth, createSubCategory)
router.put('/:id', adminAuth, editeSubCategory)
router.put('/addToSubCategory/:id', adminAuth, addToSubCategory)
router.delete('/:id', adminAuth, deleteSubCategory)
router.delete('/deleteFromSubCategory/:id', adminAuth, deleteFromSubCategory)

export default router;