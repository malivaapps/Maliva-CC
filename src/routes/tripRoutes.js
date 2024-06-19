
const express = require('express')
const router = express.Router()

const rateLimitMiddleware = require(`../middlewares/rateLimit`)
const requireAuth = require('../middlewares/requireAuth')
const { getPlanner, getTripPlanByID, saveTripPlan, deleteTripPlan } = require('../controllers/tripController')

router.use(requireAuth)
router.get('/planner', rateLimitMiddleware(5), getPlanner)
router.get('/storage', getTripPlanByID)
router.post('/storage', saveTripPlan)
router.delete('/storage/:generateID', deleteTripPlan)

module.exports = router