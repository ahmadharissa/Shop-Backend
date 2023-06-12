import db from "./database";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import Stripe from "stripe";

// Routers
import auth from "./router/auth";
import users from "./router/users";
import products from "./router/products";
import categorys from "./router/categorys";
import subCategorys from "./router/subCategorys";
import notifications from "./router/notifications";
import orders from "./router/orders";

// Models
import userModel from "./model/users";
import productModel from "./model/products";
import CategoryModel from "./model/categorys";
import SubCategoryModel from "./model/subCategorys";
import notificationModel from "./model/notifications";
import orderModel from "./model/orders";

//utils
import { userNotification } from "./utils/socket";

const app = express();
const stripe = Stripe(
  "sk_test_51NGfP7KZxC9Dz4hmdZO41jimEqjGeli1RYxRXFtLYQHb6GB4wXScmPtsZ2agq8xFCTXv7LhSULnqgWGjgyESURgI00uEZJa4C1"
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
  },
});

io.use((socket, next) => {
  if (!socket.handshake.auth.token) next(new Error("Unathorized"));
  else next();
});

userNotification(io);

app.post("/payment", (req, res) => {
  try {
    stripe.charges.create({
      amount: 22000, //In reality 220.00
      source: "tok_visa",
      currency: "usd",
      receipt_email: "ahmadharissa25@gmail.com",
      description: "Purphase",
      shipping: {
        name: "first_name",
        phone: "phone",
        carrier: "carrier",
        tracking_number: "tracking_number",
        address: {
          city: "city",
          country: "country",
          line1: "line1",
          line2: "line2",
          postal_code: "postal_code",
          state: "state",
        },
      },
      // set what ever you want of information
      metadata: {
        order_id: "6735",
        id: 1, //...
      },
    });

    return res.status(200).json({ message: "Charge successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.use("/", auth);
app.use("/user", users);
app.use("/product", products);
app.use("/category", categorys);
app.use("/subCategory", subCategorys);
app.use("/notification", notifications);
app.use("/order", orders);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Listening at port ${port || 8000}`);
});
