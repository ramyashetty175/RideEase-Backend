// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });

// io.on("connection", (socket) => {
  // ...
// });

// httpServer.listen(3000);



// socket.js

const socketio = require("socket.io");

let io;

function initSocket(server) {
  io = socketio(server, {
    cors: {
      origin: "http://localhost:5173", // your React frontend
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Receive location from driver
    socket.on("send-location", (data) => {
      // Broadcast to all admins / dashboards
      io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      io.emit("user-disconnected", socket.id);
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = { initSocket, io };