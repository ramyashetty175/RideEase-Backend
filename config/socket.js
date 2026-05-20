// const socketio = require("socket.io");

// let io;

// function initSocket(server) {
//   io = socketio(server, {
//     cors: {
//       // origin: "https://ride-ease-frontend-ashy.vercel.app", // your React frontend
//       origin: "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id);

//     // Receive location from driver
//     socket.on("send-location", (data) => {
//       // Broadcast to all admins / dashboards
//       io.emit("receive-location", { id: socket.id, ...data });
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       io.emit("user-disconnected", socket.id);
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// }

// module.exports = { initSocket, io };







const socketio = require("socket.io");

let io;

function initSocket(server) {

  io = socketio(server, {
    cors: {
      // origin: "http://localhost:5173",
      origin: "https://ride-ease-frontend-ashy.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {

    console.log("New client connected:", socket.id);

    /*
      OWNER DASHBOARD JOINS ROOM
    */
    socket.on("join-owner-room", (ownerId) => {

      socket.join(`owner-${ownerId}`);

      console.log(`Owner ${ownerId} joined room`);

    });

    /*
      RECEIVE VEHICLE LOCATION
    */
    socket.on("send-location", (data) => {
      console.log("Received GPS Data:", data);
      const {
        ownerId,
        bookingId,
        userId,
        vehicleId,
        latitude,
        longitude,
        speed
      } = data;

      /*
        BASIC VALIDATION
      */
      if (!ownerId || !vehicleId) {
        return;
      }

      /*
        SPEED CHECK
        GPS speed is in meters/second
      */
      const vehicleSpeed = speed || 0;
      console.log("Vehicle Speed:", vehicleSpeed);

      /*
        ONLY MOVING VEHICLES
        2 m/s ≈ 7 km/h
      */
      // const isMoving = vehicleSpeed > 2;
      const isMoving = true;
      console.log("Is Moving:", isMoving);

      if (isMoving) {

        console.log(
          `Moving Vehicle ${vehicleId}: ${latitude}, ${longitude}`
        );

        /*
          SEND ONLY TO PARTICULAR OWNER
        */
        io.to(`owner-${ownerId}`).emit(
          "receive-location",
          {
            bookingId,
            userId,
            vehicleId,
            latitude,
            longitude,
            speed: vehicleSpeed
          }
        );

      }

    });

    /*
      DISCONNECT
    */
    socket.on("disconnect", () => {

      console.log("Client disconnected:", socket.id);

    });

  });

}

module.exports = { initSocket, io };