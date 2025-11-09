const mongoose = require('mongoose');

const UserAuthenSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
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
    insuranceDoc: {
      type: String,
      default: null
    },
    licenceDoc: {
      type: String,
      default: null
    },
    insuranceVerified: {
      type: Boolean,
      default: false
    },
    licenceVerified: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: false
    }
}, { timestamps: true })

const User = mongoose.model('User', UserAuthenSchema);

module.exports = User;