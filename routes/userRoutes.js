const router = require('express').Router();
const userController = require('../controllers/userControllers')


router.post('/create', userController.createUser)

// login routes
router.post('/login', userController.loginUser)

// forgot Password
router.post('/forgot_password', userController.forgotPassword)

// verify OTP and reset password
router.post('/verify_otp', userController.verifyOtpAndSetPassword)


// Exporting the routes
module.exports = router

