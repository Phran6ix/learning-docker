const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    require: [true, "input a password"],
  },
});

module.exports = mongoose.model("User", userSchema);
