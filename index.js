const express = require('express');
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
app.post('/users/register', usersCtlr.register);
app.post('/users/login', usersCtlr.login);

// Private Route
app.get('/users', authenticateUser, authorizeUser(['admin', 'owner']), usersCtlr.list);
app.put('/users/approveOwner/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.approveOwner);
app.delete('/users/profile/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.remove);
app.get('/users/listOwners', authenticateUser, authorizeUser(['admin']), usersCtlr.listOwners);
app.get('users/search', authenticateUser, usersCtlr.search);

// Authenticated User Profile
app.get('/users/account', authenticateUser, usersCtlr.account);
app.put('/users/profile/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), usersCtlr.updateProfile);
app.put('/users/password/:id', authenticateUser, usersCtlr.changePassword);

// Vehicle
app.post('/api/vehicles', authenticateUser, authorizeUser(['owner', 'admin']), vehiclesCtlr.create);
app.get('/api/vehicles/:id', authenticateUser, vehiclesCtlr.show);
app.get('/api/vehicles', authenticateUser, vehiclesCtlr.listVehicles);
app.put('/api/vehicles/:id', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesCtlr.update);
app.put('/api/vehicles/approveOwner/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.approveVehicle);
app.get('/api/vehicles/search', authenticateUser, vehiclesCtlr.search);
app.delete('/api/vehicles/:id', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesCtlr.remove);

// Booking
app.post('/api/bookings', authenticateUser, bookingsCtlr.create);
app.get('/api/bookings/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.show);
app.get('/api/bookings', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.listBookings);
app.put('/api/bookings/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.update);
app.delete('/api/bookings/:id', authenticateUser, authorizeUser(['admin', 'owner', 'user']), bookingsCtlr.remove);
app.put('/api/bookings/approve/:id', authenticateUser, authorizeUser(['admin', 'owner']), bookingsCtlr.approve);
app.post('/api/bookings/checkAvailability', authenticateUser, bookingsCtlr.checkAvailability);
app.put('/api/bookings/confirm/:id', authenticateUser, bookingsCtlr.confirm);   
app.put('/api/bookings/start/:id', authenticateUser, bookingsCtlr.startTrip);  
app.put('/api/bookings/end/:id', authenticateUser, bookingsCtlr.endTrip);     
app.put('/api/bookings/extend/:id', authenticateUser, bookingsCtlr.extend); 

// BookingCancellation
app.post('/api/bookingCancellation/requestCancel/:id', authenticateUser, bookingCancellationCtlr.requestCancel);
app.get('/api/bookingCancellation/:id', authenticateUser, bookingCancellationCtlr.show);
app.put('/api/bookingCancellation/approveCancel/:id', authenticateUser, authorizeUser(['owner']), bookingCancellationCtlr.approveCancel);

// payment
app.post('/api/payments/createOrder', authenticateUser, paymentCtlr.createOrder);
app.post('/api/payments/verify', authenticateUser, paymentCtlr.verifyPayment);
app.get('/api/payments/cancel', authenticateUser, paymentCtlr.cancel);
app.get('/api/payment/:id', authenticateUser, paymentCtlr.show);
app.get('/api/payments', authenticateUser, paymentCtlr.list);

// AI ChatBot
app.post('/api/chat', authenticateUser, chatCtlr.askAI);

// Image Upload
app.post('/api/upload/avatar', authenticateUser, imageUpload.avatar);

// VehicleTracking
app.post('/api/vehicleTrackings', authenticateUser, vehiclesTrackingCtlr.create);
app.get('/api/vehicleTrackings/live/:id', authenticateUser, vehicleTrackingCtlr.live);
//app.get('/api/vehicleTrackings/history/:id/?startDate&endDate', authenticateUser, vehicleTrackingCtlr.history);
app.get('/api/vehicleTrackings/alerts/:id', authenticateUser, vehicleTrackingCtlr.alerts);
app.get('/api/vehicleTrackings/hourlycost/:id', authenticateUser, vehicleTrackingCtlr.hourlyCost); // bookingId

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

app.listen(port, () => {
    console.log('server is running on port', port);
})
