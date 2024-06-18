const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommedationController');

router.get('/', getRecommendations);

module.exports = router;
