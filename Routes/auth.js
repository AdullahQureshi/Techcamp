const express = require('express')
const {register, login,getMe,ForgetPassword,resetPassword,updateDetails,updatePassword,logout} = require('../Controllers/auth')
const {protect } = require('../Middleware/auth.js')

const router = express.Router()
router.post('/register',register)
router.post('/login', login)
router.get('/me',protect,getMe)
router.post('/Forgetpassword',ForgetPassword)
router.put('/resetPassword/:resettoken',resetPassword)
router.put('/updateDetails',protect,updateDetails)
router.put('/updatePassword',protect,updatePassword)
router.get('/logout', logout);

module.exports = router
