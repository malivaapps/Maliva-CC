const express = require('express')
const app = express()
const cors = require('cors');
const router = express.Router();
const { config } = require('./src/config/authServices')

const rateLimit = require(`./src/middlewares/rateLimit`)
const { errorResponse } = require('./src/utils/response')

const authRoutes = require('./src/routes/authRoutes')
const tripRoutes = require('./src/routes/tripRoutes')
const destinationRoutes = require('./src/routes/destinationRoutes')
const recommedationRoutes = require('./src/routes/recommendationRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit(100));

app.use(cors());
app.set('trustProxy', 1);

router.use('/authenticate', authRoutes)
router.use('/trip', tripRoutes)
router.use('/destination', destinationRoutes)
router.use('/recommendation', recommedationRoutes)

router.get("/", (req, res) => {
  res.json("Welcome to Maliva API")
})

router.use('*', function (req, res) {
  errorResponse(res, 500, "Request Invalid")
});

app.use('/api/v1', router);
app.listen(config.port, () => {
  console.log(`Server is listening on ${config.port}`)
})