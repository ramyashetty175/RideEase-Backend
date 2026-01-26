// const socketio = require("socket.io");

// let io;

// function initSocket(server) {
//     io = socketio(server, {
//         cors: {
//         origin: "http://localhost:5173", // React frontend
//         methods: ["GET", "POST"],
//         credentials: true
//     }
//     });

//     io.on("connection", (socket) => {
//         console.log("New client connected: ", socket.id);

//         // Receive location from driver
//         socket.on("send-location", (data) => {
//             // Broadcast to all admins / dashboards
//             io.emit("receive-location", { id: socket.id, ...data });
//         });

//         // Handle disconnect
//         socket.on("disconnect", () => {
//             io.emit("user-disconnected", socket.id);
//             console.log("Client disconnected:", socket.id);
//         });
//     });
// }

// module.exports = { initSocket, io };


const socketio = require("socket.io");

// Store last locations for speed calculation
let driverLocations = {}; // { vehicleId: { lat, lng, time } }
const SPEED_LIMIT = 60; // km/h, change as needed

let io;

function getDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula to calculate distance in km
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km
}

function initSocket(server) {
    io = socketio(server, {
        cors: {
            origin: "http://localhost:5173", // React frontend
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected: ", socket.id);

        // Owner/Admin joins room
        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            socket.roomId = roomId;
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });

        // Driver sends location update
        socket.on("send-location", (data) => {
            const { vehicleId, lat, lng, ownerId } = data;
            const now = Date.now();

            // Calculate speed from previous point
            let speed = 0;
            const prev = driverLocations[vehicleId];
            if (prev) {
                const distance = getDistance(prev.lat, prev.lng, lat, lng); // km
                const timeH = (now - prev.time) / 3600000; // hours
                speed = distance / timeH;
            }

            driverLocations[vehicleId] = { lat, lng, time: now };

            const isOverspeed = speed > SPEED_LIMIT;

            // Send update to owner room
            io.to(`owner_${ownerId}`).emit("vehicle:update", {
                vehicleId,
                lat,
                lng,
                speed: speed.toFixed(2),
                isOverspeed,
            });

            // Send update to admin room
            io.to("admin").emit("vehicle:update", {
                vehicleId,
                lat,
                lng,
                speed: speed.toFixed(2),
                isOverspeed,
            });
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
            if (socket.roomId) {
                io.to(socket.roomId).emit("user-disconnected", { socketId: socket.id });
            }
        });
    });
}

module.exports = { initSocket };