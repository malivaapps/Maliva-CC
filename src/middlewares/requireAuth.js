// const { getSession } = require('../services/authDataServices')
const jwt = require('jsonwebtoken')
require('dotenv')

// const requireAuth = async (req, res, next) => {
//      const { authorization } = req.headers
//      if (!authorization) {
//           return res.status(401).json({ error: "Authorization token required" })
//      }
//      const session = authorization.split(' ')[1]
//      try {
//           const user = await getSession(session)
//           if (user != null) {
//                req.userID = user.userID
//                req.session = session
//                next()
//           } else {
//                res.status(401).json({ error: "Session Invalid" })
//           }
//      } catch (err) {
//           res.status(401).json({ error: err.message })
//      }
// }

const requireAuth = async (req, res, next) => {
     const { authorization } = req.headers
     if (!authorization) {
          return res.status(401).json({ error: "Access Token required" })
     }
     const accessToken = authorization.split(' ')[1]
     try {
          const { userID } = jwt.verify(accessToken, process.env.SECRET_KEY)
          req.userID = userID
          next()

     } catch (err) {
          res.status(401).json({ error: err.message })
     }
}

module.exports = requireAuth