const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3010;

const configureDB = require('./config/db');
configureDB();

const authenticateUser = require('./app/middlewares/authenticateUser');
const authorizeUser = require('./app/middlewares/authorizeUser');
const usersCtlr = require('./app/controllers/user-Authcontroller');
const vehiclesCtlr = require('./app/controllers/vehicle-controller');
const bookingsCtlr = require('./app/controllers/booking-controller');
const paymentCtlr = require('./app/controllers/payment-controller');
const reviewCtlr = require('./app/controllers/review-controller');
const subscriptionCtlr = require('./app/controllers/subscription-controller');
const earningAnalyticsCtlr = require('./app/controllers/earningAnalytics-controller');

// Public Route
app.post('/users/register', usersCtlr.register);
app.post('/users/login', usersCtlr.login);

// Private Route
app.get('/users', authenticateUser, authorizeUser(['admin', 'owner']), usersCtlr.list);
app.delete('/users/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.remove);
app.get('/users/account', authenticateUser, usersCtlr.account);
// Vehicle
app.post('/api/vehicles', authenticateUser, authorizeUser(['admin', 'owner']), vehiclesCtlr.create);
app.get('/api/vehicles/:id', authenticateUser, vehiclesCtlr.show);
app.get('/api/vehicles', authenticateUser, vehiclesCtlr.list);
app.put('/api/vehicles/:id', authenticateUser, vehiclesCtlr.update);
app.delete('/api/vehicles/:id', authenticateUser, vehiclesCtlr.remove);
// Booking
app.post('/api/bookings', authenticateUser, bookingsCtlr.create);
app.get('/api/bookings/:id', authenticateUser, bookingsCtlr.show);
app.get('/api/bookings', authenticateUser, bookingsCtlr.list);
app.put('/api/bookings/:id', authenticateUser, bookingsCtlr.update);
app.delete('/api/bookings/:id', authenticateUser, bookingsCtlr.remove);
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
app.put('/api/reviews', authenticateUser, reviewCtlr.update);
app.delete('/api/reviews', authenticateUser, reviewCtlr.remove);
// subscription 
app.post('/api/subscription', authenticateUser, subscriptionCtlr.create);
app.get('/api/subscription/:id', authenticateUser, subscriptionCtlr.show);
app.get('/api/subscription', authenticateUser, subscriptionCtlr.list);
app.put('/api/subscription', authenticateUser, subscriptionCtlr.update);
app.delete('/api/subscription', authenticateUser, subscriptionCtlr.remove);
// EarningAnalytics
app.post('/api/earningsAnalytics', authenticateUser, earningAnalyticsCtlr.create);
app.get('/api/earningsAnalytics/:id', authenticateUser, earningAnalyticsCtlr.show);
app.get('/api/earningsAnalytics', authenticateUser, earningAnalyticsCtlr.list);
app.put('/api/earningsAnalytics/:id', authenticateUser, earningAnalyticsCtlr.update);
app.delete('/api/earningsAnalytics/:id', authenticateUser, earningAnalyticsCtlr.remove);

app.listen(port, () => {
    console.log('server is running on port', port);
})

