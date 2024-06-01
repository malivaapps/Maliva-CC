const express = require('express')
const router = express.Router()
const { getAllDestinations, getDestinationDetails, getDestinationReview, createReview, uploadImage } = require("../controllers/destinationController")

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/', getAllDestinations);

router.get('/:destinationID', getDestinationDetails);

router.get('/:destinationID/reviews', getDestinationReview);

router.post('/:destinationID/reviews', createReview);

router.post('/:destinationID/gallery', upload.single('image'), uploadImage);

module.exports = router