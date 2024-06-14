const { successResponse } = require('../utils/response')


const generatePlan = (req, res) => {
     successResponse(res, 200, "Plan Generated Successfully", { data: "SOLO, JOGJA" })
}

const saveTripPlan = (req, res) => {
     successResponse(res, 200, "Plan Saved Successfully")
}

module.exports = {
     generatePlan,
     saveTripPlan
}