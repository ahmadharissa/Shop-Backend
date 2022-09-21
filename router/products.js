import express from 'express'
import multer from "multer";

//controller
import { getProducts, getProduct, createProduct, editeProduct, deleteProduct, assignImages, deleteImage } from '../controller/products'

//middleware
import adminAuth from '../middleware/adminAuth';

const storage = multer.diskStorage({
    destination: "./uploads/products",
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    },
});
const upload = multer({ storage: storage });
const router = express.Router();

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', adminAuth, createProduct)
router.put('/:id', adminAuth, editeProduct)
router.delete('/:id', adminAuth, deleteProduct)
router.post("/assignImages/:id", adminAuth, upload.array("images", process.env.NUMBER_OF_PRODUCTS_IMAGES), assignImages);
router.delete("/image/:id/:image", adminAuth, deleteImage);

export default router;