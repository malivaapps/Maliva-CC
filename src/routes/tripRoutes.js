
const express = require('express')
const router = express.Router()

const rateLimitMiddleware = require(`../middlewares/rateLimit`)
const requireAuth = require('../middlewares/requireAuth')
const {generatePlan, saveTripPlan} = require('../controllers/tripController')

router.use(requireAuth)
router.get('/planner',rateLimitMiddleware(5), generatePlan)
router.post('/storage', saveTripPlan)

module.exports = router