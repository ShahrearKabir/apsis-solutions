const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const notificationSchema = mongoose.Schema({
    from:{
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    to:[{
        type: Schema.Types.ObjectId,
        ref: "employee"
    }],
    type:{                              //profileUpdate, roleChange, assignAsManager, leaveAppliocation,
        type: String,
        require: true
    },
    route: {                            //socket, sms, email
        type: String,
        require: true
    },
    read_status:{                            // read = 1; unread = 0
        type: Number,
        default: 0
    },
    // read_status:[{                            // read = 1; unread = 0
    //     read_by: { type: Schema.Types.ObjectId, ref: "employee" },
    //     status: { type: Number, default: 0 },
    // }],
    description:{
        type: String,
    }
},
    {timestamps: true}
);

var notifications = mongoose.model('notifications', notificationSchema);
module.exports = notifications;