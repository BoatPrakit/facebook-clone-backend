const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userScheme = new Schema({
    email: {
        type: String,
        required: true,
        min: 8,
        max: 60,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    registerOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dob:{
        type: Date
    },
    gender:{
        type: String,
        required: true,
        min: 1,
        max: 1
    }
})

module.exports = mongoose.model('User', userScheme);
