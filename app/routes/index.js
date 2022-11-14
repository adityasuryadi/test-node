const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/user_controller");
router.post('/login',authController.authentication);
router.post('/register',userController.register);
module.exports = router;