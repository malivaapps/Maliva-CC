const express = require("express");
const router = express.Router();
const { getAllDestinations, getDestinationDetails, getDestinationReview, getDestinationGallery, createReview, uploadImage } = require("../controllers/destinationController");
const requireAuth = require("../middlewares/requireAuth");
const requireUpload = require("../middlewares/limitStoreImg");

router.get("/", getAllDestinations);

router.get("/:destinationID", getDestinationDetails);

router.get("/:destinationID/reviews", getDestinationReview);

router.get("/:destinationID/gallery", getDestinationGallery);

// Secure Route
router.post("/:destinationID/reviews", requireAuth, createReview);
router.post("/:destinationID/gallery", requireAuth, requireUpload, uploadImage);

module.exports = router;
