require('dotenv').config();
const jwt = require('jsonwebtoken')

const createAccessToken = (userID) => {
     return jwt.sign({ userID }, process.env.SECRET_KEY, { expiresIn: '15m' })
}

const createRefreshToken = (userID) => {
     return jwt.sign({ userID }, process.env.SECRET_KEY, { expiresIn: '1y' })
}



module.exports = { createAccessToken, createRefreshToken }