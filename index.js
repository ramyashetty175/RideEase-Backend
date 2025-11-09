const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3020;

const configureDB = require('./config/db');
configureDB();

const authenticateUser = require('./app/middlewares/authenticateUser');
const authorizeUser = require('./app/middlewares/authorizeUser');
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

// Public Route
app.post('/users/register', usersCtlr.register);
app.post('/users/login', usersCtlr.login);

// Private Route
app.get('/users', authenticateUser, authorizeUser(['admin', 'owner']), usersCtlr.list);
app.get('/users/account', authenticateUser, usersCtlr.account);
app.put('/users/approveOwner/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.approveOwner);
app.delete('/users/:id', authenticateUser, authorizeUser(['admin', 'user']), usersCtlr.remove);
app.put('/users/updateProfile/:id', authenticateUser, authorizeUser(['user']), usersCtlr.updateProfile);
app.get('/users/listOwners', authenticateUser, authorizeUser(['admin']), usersCtlr.listOwners);
app.get('users/search', authenticateUser, usersCtlr.search);
// Vehicle
app.post('/api/vehicles', authenticateUser, authorizeUser(['owner', 'admin']), vehiclesCtlr.create);
app.get('/api/vehicles/:id', authenticateUser, vehiclesCtlr.show);
app.get('/api/vehicles', authenticateUser, vehiclesCtlr.list);
app.put('/api/vehicles/:id', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesCtlr.update);
app.put('/api/vehicles/approveOwner/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.approveOwner);
app.delete('/api/vehicles/:id', authenticateUser, authorizeUser(['admin']), vehiclesCtlr.remove);
// Booking
app.post('/api/bookings', authenticateUser, bookingsCtlr.create);
app.get('/api/bookings/:id', authenticateUser, bookingsCtlr.show);
app.get('/api/bookings', authenticateUser, bookingsCtlr.list);
app.put('/api/bookings/:id', authenticateUser, bookingsCtlr.update);
app.delete('/api/bookings/:id', authenticateUser, bookingsCtlr.remove);
app.put('/api/bookings/approve/:id', authenticateUser, authorizeUser(['owner']), bookingsCtlr.approve);
app.post('/api/bookings/checkAvailability', authenticateUser, bookingsCtlr.checkAvailability);
app.put('/api/bookings/confirm/:id', authenticateUser, bookingsCtlr.confirm);   
app.put('/api/bookings/start/:id', authenticateUser, bookingsCtlr.startTrip);  
app.put('/api/bookings/end/:id', authenticateUser, bookingsCtlr.endTrip);     
app.post('/api/bookings/cancel/:id', authenticateUser, bookingsCtlr.cancel); 
app.put('/api/bookings/extend/:id', authenticateUser, bookingsCtlr.extend); 
// payment
app.post('/api/payments', authenticateUser, paymentCtlr.create);
app.get('/api/payments/:id', authenticateUser, paymentCtlr.show);
app.get('/api/payments', authenticateUser, paymentCtlr.list);
app.put('/api/payments/:id', authenticateUser, paymentCtlr.update);
app.delete('/api/payments/:id', authenticateUser, paymentCtlr.remove);
// Review
app.post('/api/reviews', authenticateUser, reviewCtlr.create);
app.get('/api/reviews/:id', authenticateUser, reviewCtlr.show);
app.get('/api/reviews', authenticateUser, reviewCtlr.list);
app.put('/api/reviews/:id', authenticateUser, reviewCtlr.update);
app.delete('/api/reviews/:id', authenticateUser, reviewCtlr.remove);
// VehicleTracking
app.post('/api/vehicleTrackings', authenticateUser, vehiclesTrackingCtlr.create);
app.get('/api/vehicleTrackings/live/:id', authenticateUser, vehicleTrackingCtlr.live);
//app.get('/api/vehicleTrackings/history/:id/?startDate&endDate', authenticateUser, vehicleTrackingCtlr.history);
app.get('/api/vehicleTrackings/alerts/:id', authenticateUser, vehicleTrackingCtlr.alerts);
app.get('/api/vehicleTrackings/hourlycost/:id', authenticateUser, vehicleTrackingCtlr.hourlyCost); // bookingId
// BookingCancellation
app.post('/api/bookingCancellation/requestCancel/:id', authenticateUser, bookingCancellationCtlr.requestCancel);
app.get('/api/bookingCancellation/:id', authenticateUser, bookingCancellationCtlr.show);
app.get('/api/bookingCancellation', authenticateUser, bookingCancellationCtlr.list);
app.put('/api/bookingCancellation/:id', authenticateUser, bookingCancellationCtlr.update);
app.delete('/api/bookingCancellation/:id', authenticateUser, bookingCancellationCtlr.remove);
app.put('/api/bookingCancellation/approveCancel/:id', authenticateUser, authorizeUser(['owner']), bookingCancellationCtlr.approveCancel);
// Notification
// app.post('/api/notifications', authenticateUser, notificationCtlr.create);
// app.get('/api/notifications/:id', authenticateUser, notificationCtlr.show);
// app.get('/api/notifications', authenticateUser, notificationCtlr.list);
// app.put('/api/notifications/:id', authenticateUser, notificationCtlr.update);
// app.delete('/api/notifications/:id', authenticateUser, authorizeUser(['admin']), notificationCtlr.remove);
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
