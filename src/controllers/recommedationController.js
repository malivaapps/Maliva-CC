const axios = require('axios');
const { config } = require('../config/authServices')

const getRecommendations = async (req, res) => {
  const searchQuery = req.query.search;

  try {
    const response = await axios.get(`${config.recommendationModel}/recommendations?search=${searchQuery}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getRecommendations };
