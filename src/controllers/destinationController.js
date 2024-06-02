const {
  getAllData,
  getDataById,
  getReviewsByDestinationId,
  addReviewToDestination,
  uploadImageToGallery
} = require("../services/getData")

const { successResponse, errorResponse } = require('../utils/response')

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await getAllData();
    successResponse(res, 200, "Successfully get data", destinations)
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message)
  }
};

const getDestinationDetails = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const destination = await getDataById(destinationID);
    successResponse(res, 200, "Successfully get destiantion details", destination)
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message)
  }
};

const getDestinationReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const reviews = await getReviewsByDestinationId(destinationID);
    successResponse(res, 200, "Successfully get destination reviews", reviews)
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message)
  }
};


const createReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const { rating, reviews } = req.body;
    const ts = new Date().getTime();
    const reviewTemplate = {
      "userID": req.userID,
      "rating": rating,
      "review": reviews,
      "createAt": ts
    }
    await addReviewToDestination(destinationID, reviewTemplate);
    successResponse(res, 200, "Review added successfully")
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message)
  }
};

const uploadImage = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const file = req.file;
    const imageUrl = await uploadImageToGallery(destinationID, file);
    successResponse(res, 201, "Image uploaded successfully", imageUrl)
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message)
  }
};

module.exports = { getAllDestinations, getDestinationDetails, getDestinationReview, createReview, uploadImage };