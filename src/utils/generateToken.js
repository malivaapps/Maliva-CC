const { config } = require('../config/authServices')
const jwt = require('jsonwebtoken')

const createAccessToken = (userID) => {
     return jwt.sign({ userID }, config.secret, { expiresIn: '15m' })
}

const createRefreshToken = (userID) => {
     return jwt.sign({ userID }, config.secret, { expiresIn: '1y' })
}

module.exports = { createAccessToken, createRefreshToken }