const express =require('express')
const router = express.Router()
// const User = require('../models/user')
const catchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../utils/Middleware')
const user = require('../controllers/user')

router.get('/register', user.registerForm)

router.post('/register' ,catchAsync(user.registerUser))

router.get('/login' , user.renderLoginForm)

router.post('/login' , storeReturnTo ,
passport.authenticate('local',{failureFlash: true , failureRedirect : '/login'}) , 
user.loginUser)

router.get('/logout' , user.logoutUser)

module.exports = router