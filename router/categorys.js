import express from "express";

//controller
import { getCategorys, getCategory, createCategory, editeCategory, deleteCategory, addToCategory, deleteFromCategory } from "../controller/categorys"

//middleware
import adminAuth from "../middleware/adminAuth";

const router = express.Router();

router.get('/', getCategorys)
router.get('/:id', getCategory)
router.post('/', adminAuth, createCategory)
router.put('/:id', adminAuth, editeCategory)
router.put('/addToCategory/:id', adminAuth, addToCategory)
router.delete('/:id', adminAuth, deleteCategory)
router.delete('/deleteFromCategory/:id', adminAuth, deleteFromCategory)

export default router;