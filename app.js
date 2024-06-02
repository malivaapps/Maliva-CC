require('dotenv').config();
const express = require('express')
const app = express()

const rateLimitMiddleware = require(`./src/middlewares/rateLimit`)
const { successResponse, errorResponse } = require('./src/utils/response')

const authRoutes = require('./src/routes/authRoutes')
const tripRoutes = require('./src/routes/tripRoutes')
const destinationRoutes = require('./src/routes/destinationRoutes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimitMiddleware(30));

app.use('/authenticate', authRoutes)
app.use('/trip', tripRoutes)
app.use('/destination', destinationRoutes)

app.get("/", (req, res) => {
  successResponse(res, 200, "Server OK")
})

app.use('*', function (req, res) {
  errorResponse(res, 500, "Request Invalid")
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running in http://localhost:${process.env.PORT}`)
})