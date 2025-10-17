const mongoose = require('mongoose');

const UserAuthenSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    newPassword: String,
    loginCount: {
       type: Number,
       default: 0
    },
    role: {
      type: String,
      default: 'user'
    }
}, { timestamps: true })

const User = mongoose.model('User', UserAuthenSchema);

module.exports = User;