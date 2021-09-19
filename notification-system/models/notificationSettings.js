const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const NotificationSettingsSchema = mongoose.Schema({
    employee_id:{
        type: Schema.Types.ObjectId,
        ref: "employee"
    },
    push_active:{
        type: Number,
        default: 1
    },
    email_active:{
        type: Number,
        default: 1
    },
    sms_active:{
        type: Number,
        default: 1
    },
},
    {timestamps: true}
);

var notification_settings = mongoose.model('notification_settings', NotificationSettingsSchema);
module.exports = notification_settings;