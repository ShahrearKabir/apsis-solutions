const mongoose = require("mongoose");
var RolesSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["super_admin", "employee", "manager", "hr_manager", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);
var Roles = mongoose.model("roles", RolesSchema);
module.exports = Roles;
