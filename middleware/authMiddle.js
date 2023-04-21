const protect = (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "You are not logged in, please try again",
    });
  }

  req.user = user;
  next();
};

module.exports = { protect };
