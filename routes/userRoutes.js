const express = require('express')

const authController = require('../controllers/authControllers')

const router = express.Router()

//localhost:3000/
router.route('/signup').post(authController.signup)

router.route('/login').post(authController.login)

module.exports = router

