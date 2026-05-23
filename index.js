const express = require('express');
const http = require("http");
const path = require("path");
const cors = require('cors');
require('dotenv').config();
require("./app/cron/booking-status-cron");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3020;

const configureDB = require('./config/db');
configureDB();

const { initSocket } = require("./config/socket.js");
const server = http.createServer(app);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
initSocket(server);

app.get("/", (req, res) => {
  // res.render("index");
  res.send("RideEase API Running");
});

const authenticateUser = require('./app/middlewares/authenticateUser');
const authorizeUser = require('./app/middlewares/authorizeUser');
const uploadMiddleware = require('./app/middlewares/fileUploadMiddleware');
const imageUpload = require('./app/controllers/upload-controller');
const usersCtlr = require('./app/controllers/user-Authcontroller');
const vehiclesCtlr = require('./app/controllers/vehicle-controller');
const bookingsCtlr = require('./app/controllers/booking-controller');
const paymentCtlr = require('./app/controllers/payment-controller');
const chatCtlr = require('./app/controllers/chat-Controller');
const reviewCtlr = require('./app/controllers/review-controller');

// Public Route
app.post('/users/register', usersCtlr.register); 
app.post('/users/login', usersCtlr.login);  

// Private Route
app.get('/users', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.list); 
app.put('/users/owner/approve/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.approveOwner); 
app.put('/users/owner/reject/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.rejectOwner); 
app.delete('/users/profile/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.remove); 
app.get('/users/owners', authenticateUser, authorizeUser(['admin']), usersCtlr.listOwners); 
app.get('/users/listUsers', authenticateUser, authorizeUser(['admin', 'owner']), usersCtlr.listUsers);

// Authenticated User Profile
app.get('/users/profile', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.profile); 
app.put('/users/profile', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.updateProfile);
app.put('/users/password/:id', authenticateUser, authorizeUser(['user']), usersCtlr.changePassword); 

// Image Upload
app.post('/api/upload/user/avatar', authenticateUser, authorizeUser(['admin', 'owner', 'user']), uploadMiddleware, imageUpload.avatar);
app.post('/api/upload/user/licence', authenticateUser, authorizeUser(['owner', 'user']), uploadMiddleware, imageUpload.licence);
app.post('/api/upload/user/insurance', authenticateUser, authorizeUser(['owner', 'user']), uploadMiddleware, imageUpload.insurance);

// Vehicle
app.post('/api/vehicles', authenticateUser, authorizeUser(['owner']), uploadMiddleware, vehiclesCtlr.create);
app.put('/api/vehicles/approve/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.approveVehicle);  
app.put('/api/vehicles/reject/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.rejectVehicle);
app.get('/api/vehicles', authenticateUser, authorizeUser(['owner', 'admin', 'user']), vehiclesCtlr.listVehicles); 
app.delete('/api/vehicles/:id', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesCtlr.remove); 
app.get('/api/vehicles/search', authenticateUser, vehiclesCtlr.search); 

// Booking
app.post('/api/bookings', authenticateUser, authorizeUser(['user']), bookingsCtlr.create);
app.get('/api/bookings', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.listBookings);
app.put('/api/bookings/approve/:id', authenticateUser, authorizeUser(['admin', 'owner']), bookingsCtlr.approve);
app.put('/api/bookings/cancel/:id', authenticateUser, authorizeUser(['admin', 'owner']), bookingsCtlr.cancel); 

// payment
app.post('/api/payments/createOrder', authenticateUser, paymentCtlr.createOrder);
app.post('/api/payments/verify', authenticateUser, paymentCtlr.verifyPayment);
app.get('/api/payments', authenticateUser, authorizeUser(['user']), paymentCtlr.list);
app.get('/api/payments/cancel', authenticateUser, paymentCtlr.cancel);

// Review
app.put('/api/reviews/add', authenticateUser, reviewCtlr.addReview);

// AI ChatBot
app.post('/api/ai/chat', authenticateUser, chatCtlr.chat);

server.listen(port, () => {
    console.log('server is running on port', port);
})