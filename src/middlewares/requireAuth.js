const { getSession } = require('../services/authDataServices')
require('dotenv')

const requireAuth = async (req, res, next) => {
     const { authorization } = req.headers
     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" })
     }
     const session = authorization.split(' ')[1]
     try {
          const user = await getSession(session)
          if (user != null) {
               req.userID = user.userID
               req.session = session
               next()
          } else {
               res.status(401).json({ error: "Session Invalid" })
          }
     } catch (err) {
          res.status(401).json({ error: err.message })
     }
}

module.exports = requireAuth