export const userNotification = (io) => {
  io.on("connection", (socket) => {
    const token = socket.handshake.auth.token;
    console.log("connection")

    socket.on("getNotifications", async () => {
      socket.emit("getNotifications");
    });
  });
};