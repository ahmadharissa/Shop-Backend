import db from './database';
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

// Routers
import auth from "./router/auth";
import users from './router/users';
import products from './router/products';
import categorys from "./router/categorys";
import notifications from "./router/notifications";
import orders from './router/orders';

// Models
import userModel from './model/users';
import productModel from "./model/products";
import CategoryModel from "./model/categorys";
import notificationModel from "./model/notifications";
import orderModel from './model/orders'

//utils
import { userNotification } from "./utils/socket";

const app = express();
app.use(express.json())
app.use(cors());
app.use(express.static("uploads"));

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    },
});

io.use((socket, next) => {
    if (!socket.handshake.auth.token) next(new Error("Unathorized"))
    else next()
});

userNotification(io);

app.use("/", auth);
app.use('/user', users);
app.use('/product', products);
app.use('/category', categorys);
app.use("/notification", notifications);
app.use("/order", orders);

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Listening at port ${port || 8000}`);
});