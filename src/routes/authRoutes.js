// ROUTE UNTUK HTTP REQEUST AUTHENTIFIKASI

const express = require('express')
const router = express.Router()

const requireAuth = require('../middlewares/requireAuth')

const { signUp, signIn, logout } = require('../controllers/authController')

router.post('/signin', signIn)
router.post('/signup', signUp)
router.delete('/logout', requireAuth, logout)

module.exports = router