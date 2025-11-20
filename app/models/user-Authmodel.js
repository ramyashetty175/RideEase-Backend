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
      enum: ["admin", "owner", "user"],
      default: 'user'
    }, 
    avatar: String,
    bio: String,
    insuranceDoc: String,
    licenceDoc: String,
    insuranceVerified: Boolean,
    licenceVerified: Boolean,
    isApproved: Boolean

}, { timestamps: true })

const User = mongoose.model('User', UserAuthenSchema);

module.exports = User;