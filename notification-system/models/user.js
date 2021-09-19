const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
},
    {timestamps: true}
);

var user = mongoose.model('users', userSchema);
module.exports = user;