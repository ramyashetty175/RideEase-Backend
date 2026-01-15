// const { updateVehicleLocation } = require('./controllers/vehicleTrackingController');

// const initSocket = function(io) {
//     io.on('connection', (socket) => {
//         console.log('User/Driver Connected:', socket.id);

//         // Driver joins a room based on bookingId
//         socket.on('join_booking', (bookingId) => {
//             socket.join(bookingId);
//             console.log(`Socket ${socket.id} joined room: ${bookingId}`);
//         });

//         // Listen for location updates from driver
//         socket.on('update_location', async (data) => {
//             // 1. Save to DB (optional: for historical tracking)
//             await updateVehicleLocation(data);
            
//             // 2. Broadcast to users in the same booking room
//             io.to(data.bookingId).emit('receive_location', {
//                 vehicleId: data.vehicleId,
//                 lat: data.lat,
//                 lng: data.lng
//             });
//         });
//         socket.on('disconnect', () => {
//             console.log('User/Driver Disconnected:', socket.id);
//         });
//     });
// };

// module.exports = initSocket;



const { Server } = require('socket.io');
const {
  updateVehicleLocation
} = require('../app/controllers/vehicleTracking-controller');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket Connected:', socket.id);

    // Join booking room
    socket.on('join_booking', (bookingId) => {
      socket.join(bookingId);
      console.log(`Socket ${socket.id} joined booking ${bookingId}`);
    });

    // Receive live location from driver
    socket.on('update_location', async (data) => {
      try {
        /*
          data = {
            bookingId,
            vehicleId,
            lat,
            lng,
            speed
          }
        */

        // Save to DB
        await updateVehicleLocation(
          { body: data },
          { status: () => ({ json: () => {} }) } // dummy res
        );

        // Broadcast to users
        io.to(data.bookingId).emit('receive_location', {
          vehicleId: data.vehicleId,
          lat: data.lat,
          lng: data.lng,
          speed: data.speed || 0,
          updatedAt: Date.now()
        });
      } catch (err) {
        console.error('Socket update error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected:', socket.id);
    });
  });
};

const getIo = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = {
  initSocket,
  getIo
};
