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
  res.render("index");
});

const authenticateUser = require('./app/middlewares/authenticateUser');
const authorizeUser = require('./app/middlewares/authorizeUser');
const uploadMiddleware = require('./app/middlewares/fileUploadMiddleware');
const imageUpload = require('./app/controllers/upload-controller');
const usersCtlr = require('./app/controllers/user-Authcontroller');
const vehiclesCtlr = require('./app/controllers/vehicle-controller');
const bookingsCtlr = require('./app/controllers/booking-controller');
const paymentCtlr = require('./app/controllers/payment-controller');
const reviewCtlr = require('./app/controllers/review-controller');
const bookingCancellationCtlr = require('./app/controllers/booking-cancellation-controller');
const vehicleTrackingCtlr = require('./app/controllers/vehicleTracking-controller');
const notificationCtlr = require('./app/controllers/notification-controller');
const subscriptionCtlr = require('./app/controllers/subscription-controller');
const earningAnalyticsCtlr = require('./app/controllers/earningAnalytics-controller');
const vehiclesTrackingCtlr = require('./app/controllers/vehicleTracking-controller');
const chatCtlr = require('./app/controllers/chat-Controller');

// Public Route
app.post('/users/register', usersCtlr.register); //
app.post('/users/login', usersCtlr.login);  //

// Private Route
app.get('/users', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.list); //
app.put('/users/owner/approve/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.approveOwner);  // button
app.put('/users/owner/reject/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.rejectOwner); 
app.delete('/users/profile/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.remove); //button
app.get('/users/owners', authenticateUser, authorizeUser(['admin']), usersCtlr.listOwners); //
app.get('/users/listUsers', authenticateUser, authorizeUser(['admin']), usersCtlr.listUsers);
// app.get('/users/search', authenticateUser, usersCtlr.search); //

// Authenticated User Profile
app.get('/users/profile', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.profile); //
app.put('/users/profile', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.updateProfile); //
app.put('/users/password/:id', authenticateUser, authorizeUser(['user']), usersCtlr.changePassword); //

// Vehicle
app.post('/api/vehicles', authenticateUser, authorizeUser(['owner', 'admin']), uploadMiddleware, vehiclesCtlr.create);
app.put('/api/vehicles/:id', authenticateUser, authorizeUser(['admin', 'owner']), uploadMiddleware, vehiclesCtlr.update);
app.put('/api/vehicles/approve/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.approveVehicle);  
app.put('/api/vehicles/reject/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.rejectVehicle);
app.get('/api/vehicles', authenticateUser, authorizeUser(['owner', 'admin', 'user']), vehiclesCtlr.listVehicles); //
app.delete('/api/vehicles/:id', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesCtlr.remove); // button
app.get('/api/vehicles/search', authenticateUser, authorizeUser(['admin', 'owner', 'user']), vehiclesCtlr.search);
app.get('/api/vehicles/:id', authenticateUser, vehiclesCtlr.show);  
app.get('/api/vehicles/available', authenticateUser, vehiclesCtlr.available);

// Booking
app.post('/api/bookings', authenticateUser, bookingsCtlr.create);
app.get('/api/bookings/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.show);
app.get('/api/bookings', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.listBookings);
app.put('/api/bookings/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.update);
app.delete('/api/bookings/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.remove);
app.put('/api/bookings/approve/:id', authenticateUser, authorizeUser(['admin', 'owner']), bookingsCtlr.approve);
app.put('/api/bookings/cancel/:id', authenticateUser, authorizeUser(['admin', 'owner']), bookingsCtlr.cancel);
app.put('/api/bookings/check/:id', authenticateUser,bookingsCtlr.checkAvailability);
app.put('/api/bookings/confirm/:id', authenticateUser, authorizeUser(['admin', 'user']), bookingsCtlr.confirm);   
app.put('/api/bookings/start/:id', authenticateUser, authorizeUser(['admin', 'user']), bookingsCtlr.startTrip);  
app.put('/api/bookings/end/:id', authenticateUser, authorizeUser(['admin', 'user']), bookingsCtlr.endTrip);     
app.put('/api/bookings/extend/:id', authenticateUser, authorizeUser(['admin', 'user']), bookingsCtlr.extend); 

// BookingCancellation
app.post('/api/bookingCancellation/request/:id', authenticateUser, authorizeUser(['user']), bookingCancellationCtlr.requestCancel);
app.get('/api/bookingCancellation/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingCancellationCtlr.show);
app.get('/api/bookingCancellation', authenticateUser, authorizeUser(['admin', 'owner', 'user'], bookingCancellationCtlr.list));
app.put('/api/bookingCancellation/approve/:id', authenticateUser, authorizeUser(['admin','owner']), bookingCancellationCtlr.approveCancel);

// payment
app.post('/api/payments/createOrder', paymentCtlr.createOrder);
app.post('/api/payments/verify', paymentCtlr.verifyPayment);
// app.get('/api/payments/cancel', authenticateUser, paymentCtlr.cancel);
// app.get('/api/payment/:id', authenticateUser, paymentCtlr.show);
// app.get('/api/payments', authenticateUser, paymentCtlr.list);

// AI ChatBot
app.post('/api/chat', authenticateUser, chatCtlr.askAI);

// Image Upload
app.post('/api/upload/user/avatar', authenticateUser, authorizeUser(['admin', 'owner', 'user']), uploadMiddleware, imageUpload.avatar);
app.post('/api/upload/user/licence', authenticateUser, authorizeUser(['owner', 'user']), uploadMiddleware, imageUpload.licence);
app.post('/api/upload/user/insurance', authenticateUser, authorizeUser(['owner', 'user']), uploadMiddleware, imageUpload.insurance);

// VehicleTracking
// app.post('/api/vehicleTrackings', authenticateUser, vehiclesTrackingCtlr.create);
// app.post('/api/vehicleTrackings/live', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesTrackingCtlr.updateVehicleLocation );

// Review
app.post('/api/reviews', authenticateUser, reviewCtlr.create);
app.get('/api/reviews/:id', authenticateUser, reviewCtlr.show);
app.get('/api/reviews', authenticateUser, reviewCtlr.list);
app.put('/api/reviews/:id', authenticateUser, reviewCtlr.update);
app.delete('/api/reviews/:id', authenticateUser, reviewCtlr.remove);

// Notification
app.post('/api/notifications', authenticateUser, notificationCtlr.create);
app.get('/api/notifications/:id', authenticateUser, notificationCtlr.show);
app.get('/api/notifications', authenticateUser, notificationCtlr.list);
app.put('/api/notifications/:id', authenticateUser, notificationCtlr.update);

// Subscription 
app.post('/api/subscriptions', authenticateUser, subscriptionCtlr.create);
app.get('/api/subscriptions/:id', authenticateUser, subscriptionCtlr.show);
app.get('/api/subscriptions', authenticateUser, subscriptionCtlr.list);
app.put('/api/subscriptions/:id', authenticateUser, subscriptionCtlr.update);
app.delete('/api/subscriptions/:id', authenticateUser, subscriptionCtlr.remove);

// EarningAnalytics
app.post('/api/earningsAnalytics', authenticateUser, earningAnalyticsCtlr.create);
app.get('/api/earningsAnalytics/:id', authenticateUser, earningAnalyticsCtlr.show);
app.get('/api/earningsAnalytics', authenticateUser, earningAnalyticsCtlr.list);
app.put('/api/earningsAnalytics/:id', authenticateUser, earningAnalyticsCtlr.update);
app.delete('/api/earningsAnalytics/:id', authenticateUser, earningAnalyticsCtlr.remove);

server.listen(port, () => {
    console.log('server is running on port', port);
})