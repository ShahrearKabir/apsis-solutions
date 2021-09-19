const mongoose = require("mongoose");
const { Schema } = require("mongoose");

var LeavesSchema = mongoose.Schema(
  {
    start_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    leave_type: {
      type: String
    },
    submitted_by: {
      type: Schema.Types.ObjectId,
      ref: "employee"
    },
    submitted_to: {
      type: Schema.Types.ObjectId,
      ref: "employee"
    },
    status:{
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);
var Leaves = mongoose.model("leaves", LeavesSchema);
module.exports = Leaves;
