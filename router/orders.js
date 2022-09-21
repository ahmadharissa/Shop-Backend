import express from "express";

//controller
import { createOrder, getOrders } from "../controller/orders";

//middleware
import adminAuth from "../middleware/adminAuth";
import userAuth from "../middleware/userAuth";

const router = express.Router();

router.get("/", adminAuth, getOrders);
router.post("/", userAuth, createOrder);

export default router;
