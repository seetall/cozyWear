const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    
    

    resetPasswordOTP: {
        type: Number,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    },

    isAdmin: {
        type: Boolean,
        default: false
    }

})

const User = mongoose.model('users', userSchema)
module.exports = User;
