const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signip = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 13);
    const newUser = await User.create({
      username,
      password: hashedpassword,
    });
    res.status(200).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const iscorrect = await bcrypt.compare(password, user.password);

    if (!iscorrect) {
      return res.status(400).json({
        message: "Incorrect details",
      });
    }

    req.session.user = user;
    // req.session.views = (req.session.views || 0) + 1;
    res.status(200).json({
      message: "You are logged in",
    });
  } catch (error) {}
};
