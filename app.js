require('dotenv').config();
const express = require('express')
const app = express()

const rateLimitMiddleware = require(`./src/middlewares/rateLimit`)

const authRoutes = require('./src/routes/authRoutes')
const tripRoutes = require('./src/routes/tripRoutes')
const destinationRoutes = require('./src/routes/destinationRoutes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimitMiddleware(10));

app.use('/authenticate', authRoutes)
app.use('/trip', tripRoutes)
app.use('/destination', destinationRoutes)

app.get("/", (req, res) => {
  res.status(200).json({ mssg: "OK" })
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running in http://localhost:${process.env.PORT}`)
})