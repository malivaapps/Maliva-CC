const {
  getAllData,
  getDataById,
  getReviewsByDestinationId,
  getGalleryByDestinationId,
  addReviewToDestination,
  uploadImageToGallery
} = require("../services/getData")

const { successResponse, errorResponse } = require('../utils/response')

// Filtering Destination Search
const getAllDestinations = async (req, res) => {
  try {
    const { activities, category, minPrice, maxPrice, minRange, maxRange, minRating, maxRating } = req.query;
    const destinations = await getAllData();

    // Parse categories and activities into arrays if they are comma-separated strings
    const categories = category ? category.split(' ') : null;
    const activitiesList = activities ? activities.split(' ') : null;

    const filters = {
      minPrice: minPrice,
      maxPrice: maxPrice,
      minRange: minRange,
      maxRange: maxRange,
      // minRating: minRating,
      // maxRating: maxRating,
    };

    const filterData = destinations.filter(data => {
      return (
        (!categories || categories.includes(data.Category)) &&
        (!activitiesList || activitiesList.some(activity => data.Activities.includes(activity))) &&
        (!filters.minPrice || data.Price >= filters.minPrice) &&
        (!filters.maxPrice || data.Price <= filters.maxPrice) &&
        (!filters.minRange || data.Range >= filters.minRange) &&
        (!filters.maxRange || data.Range <= filters.maxRange)
        // (!filters.minRating || data.Rating >= filters.minRating) &&
        // (!filters.maxRating || data.Rating <= filters.maxRating)
      );
    });

    successResponse(res, 200, "Successfully get data", filterData);
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
};


//Display Destination details by Id
const getDestinationDetails = async (req, res) => {
  try {
    const { destinationID } = req.params;

    const destination = await getDataById(destinationID);
    successResponse(res, 200, "Successfully get destiantion details", destination)
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
};

//Display Destination gallery by Id
const getDestinationGallery = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const images = await getGalleryByDestinationId(destinationID);
    successResponse(res, 200, "Successfully get destination gallery", images);
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
}

//Display Destination Reviews by Id
const getDestinationReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const reviews = await getReviewsByDestinationId(destinationID);
    successResponse(res, 200, "Successfully get destination reviews", reviews)
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message)
  }
};


//Create Review per destinationId
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

//Upload Gallery per destinationId
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

module.exports = { getAllDestinations, getDestinationDetails, getDestinationReview, getDestinationGallery, createReview, uploadImage };