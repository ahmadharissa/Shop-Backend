import express from "express";
import multer from "multer";

//controller
import { getUsers, getUser, editUser, deleteUser, updateImage, addToWishList, removeFromWishList, removeAllWishList } from "../controller/users"

//middleware
import adminAuth from "../middleware/adminAuth";
import userAuth from "../middleware/userAuth";

const storage = multer.diskStorage({
    destination: "./uploads/users",
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    },
});
const upload = multer({ storage: storage });
const router = express.Router();

router.get('/', adminAuth, getUsers);
router.put("/updateImage", userAuth, upload.single("avatar"), updateImage);
router.get('/:id', getUser);
router.put('/:id', userAuth, editUser);
router.delete('/:id', adminAuth, deleteUser)
router.post("/addToWishlist", userAuth, addToWishList);
router.post("/removeFromWishList", userAuth, removeFromWishList);
router.patch("/removeAllWishList", userAuth, removeAllWishList);

export default router