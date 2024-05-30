// ROUTE UNTUK HTTP REQEUST AUTHENTIFIKASI

const express = require('express')
const router = express.Router()

router.post('/signin', (req, res) => {
     res.send({ mssg: "Generate Trip Planner" })
})
router.post('/signup', (req, res) => {
     res.send({ mssg: "Generate Trip Planner" })
})
router.post('/refresh', (req, res) => {
     res.send({ mssg: "Generate Trip Planner" })
})
router.post('/logout', (req, res) => {
     res.send({ mssg: "Generate Trip Planner" })
})

module.exports = router