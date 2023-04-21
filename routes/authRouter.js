const router = require("express").Router();
const AuthController = require("../controller/authController");

router.post("/signup", AuthController.signip);
router.post("/login", AuthController.login);

module.exports = router;
