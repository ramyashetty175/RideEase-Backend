const mongoose = require('mongoose');

async function configureDB() {
    try {
        mongoose.connect(process.env.DB_URL);
        console.log("connected to DB");
    } catch(err) {
        console.log("error occured in DB");
    }
}

module.exports =configureDB