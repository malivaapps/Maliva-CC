const express = require('express')
const router = express.Router()
const { getAllDestinations, getDestinationDetails, getDestinationReview, createReview, uploadImage } = require("../controllers/destinationController")
const requireAuth = require('../middlewares/requireAuth')

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getAllDestinations);

router.get('/:destinationID', getDestinationDetails);

router.get('/:destinationID/reviews', getDestinationReview);


// Secure Route
router.post('/:destinationID/reviews',requireAuth, createReview);
router.post('/:destinationID/gallery',requireAuth, upload.single('image'), uploadImage);

module.exports = router