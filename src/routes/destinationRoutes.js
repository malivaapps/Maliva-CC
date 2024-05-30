const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
     res.send({ mssg: "Get destination" })
})

router.get('/:destinationID', (req, res) => {
     res.send({ mssg: "Get details" })
})

router.get('/:destinationID/reviews', (req, res) => {
     res.send({ mssg: "GET reviews" })
})
router.post('/:destinationID/reviews', (req, res) => {
     res.send({ mssg: "post reviews" })
})

module.exports = router