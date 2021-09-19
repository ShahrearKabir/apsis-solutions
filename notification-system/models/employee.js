const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const userSchema = mongoose.Schema({
    user_id:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    phone_number:{
        type: String,
    },
    email:{
        type: String,
    },
    manager_id:{
        type: Schema.Types.ObjectId,
        ref: "employee"
    },
    role_ids:[{
        type: Schema.Types.ObjectId,
        ref: "roles"
    }]
},
    {timestamps: true}
);

var user = mongoose.model('employee', userSchema);
module.exports = user;