import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
