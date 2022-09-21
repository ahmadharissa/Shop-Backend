import express from "express";

//controller
import { deleteNotification, getNotifications, createNotification } from "../controller/notifications";

//middleware
import userAuth from "../middleware/userAuth";
import adminAuth from "../middleware/adminAuth";

const router = express.Router();

router.get("/", userAuth, getNotifications);
router.post("/", adminAuth, createNotification);
router.delete("/:id", adminAuth, deleteNotification);

export default router;
