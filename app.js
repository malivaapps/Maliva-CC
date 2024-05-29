require('dotenv').config();

const express = require('express')
const app = express()

app.get("/", (req, res) => {
  res.status(200).json({mssg: "OK"})
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} `)
})