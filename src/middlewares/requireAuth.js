const jwt = require('jsonwebtoken')
require('dotenv')

const requireAuth = async (req, res, next) => {
     const { authorization } = req.headers
     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" })
     }
     const token = authorization.split(' ')[1]
     try {
          const { credential_id } = jwt.verify(token, process.env.SECRET)
          req.userId = credential_id
          next()
     } catch {
          res.status(401).json({ error: "Request is not authorized" })
     }
}

module.exports = requireAuth