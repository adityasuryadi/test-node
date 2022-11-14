const express = require('express')
const router = express.Router()
const userController = require("../controllers/user_controller")

// router.post('/register',userController.create);
router.post('/authenticate',userController.authenticate);
router.get('/test/:phone',userController.test);
router.put('/updateAccount',userController.edit);
router.put('/updatePassword',userController.updatePassword);
router.put('/updateProfile',userController.editProfile);
module.exports = router;