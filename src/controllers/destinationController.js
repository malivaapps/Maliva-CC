const { getAllData, getDataById, getReviewsByDestinationId, getGalleryByDestinationId, addReviewToDestination, updateRatingupdateDestinationRating, uploadImageToGallery } = require("../services/getData");
const { successResponse, errorResponse } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");
const { getSession } = require("../services/authDataServices")
const { addDataHistory } = require("../services/authDataServices")
const { getUserById } = require("../services/authDataServices")
// Formula for determining between two points
const haversineDistance = (lat1, long1, lat2, long2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Filtering Destination Search
const getAllDestinations = async (req, res) => {
  try {
    const { type, category, minPrice, maxPrice, minRange, maxRange, rating, search } = req.query;

    // Check if there are any query parameters
    const hasQueryParams = Object.keys(req.query).length > 0;

    // Check if the user is authenticated
    const authorization = req.headers.authorization;
    let userID = null;
    if (authorization) {
      const session = authorization.split(' ')[1];
      try {
        const user = await getSession(session);
        if (user) {
          userID = user.userID;
        }
      } catch (err) {
        // Handle error (e.g., log it) but continue to allow unauthenticated access
        console.error("Authentication error:", err.message);
      }
    }
    // Check if the search query is at least 5 characters
    if (hasQueryParams && userID && search && search.length >= 5) {
      const searchID = uuidv4();
      const searchHistoryData = {
        search,
        timestamp: new Date().getTime(),
        userID: userID,
      };
      // Filter out undefined values from searchHistoryData
      const filteredSearchHistoryData = Object.fromEntries(
        Object.entries(searchHistoryData).filter(([_, v]) => v !== undefined)
      );

      await addDataHistory(searchID, filteredSearchHistoryData);
    }

    let destinations = await getAllData();

    const { lat, long } = req.query;
    if (lat && long && minRange && maxRange) {
      const originLat = parseFloat(lat);
      const originLong = parseFloat(long);
      destinations = destinations.map((data) => ({
        ...data,
        Range: haversineDistance(originLat, originLong, data.latitude, data.longitude),
      }));
    }

    const categories = category ? category.split(" ") : null;
    const typeList = type ? type.split(" ") : null;

    const filters = {
      search: search,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      minRange: minRange,
      maxRange: maxRange,
      rating: Number(rating),
    };

    const filterData = destinations.filter((data) => (
      (!search || data["Nama Wisata"].toLowerCase().includes(filters.search.toLowerCase())) &&
      (!categories || categories.some((cat) => data["Kategori"].toLowerCase().includes(cat.toLowerCase()))) &&
      (!typeList || typeList.some((t) => data["Jenis Wisata"].toLowerCase().includes(t.toLowerCase()))) &&
      (!filters.minPrice || Number(data["Harga"]) >= filters.minPrice) &&
      (!filters.maxPrice || Number(data["Harga"]) <= filters.maxPrice) &&
      (!filters.minRange || data.Range >= filters.minRange) &&
      (!filters.maxRange || data.Range <= filters.maxRange) &&
      (!filters.rating || Math.floor(data.Rating) == filters.rating)
    ));

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
    successResponse(res, 200, "Successfully get destiantion details", destination);
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
};

//Display Destination Reviews by Id
const getDestinationReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const reviews = await getReviewsByDestinationId(destinationID);
    successResponse(res, 200, "Successfully get destination reviews", reviews);
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
};

//Create Review per destination by Id
const createReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    let { rating, reviews } = req.body;
    const ts = new Date().getTime();

    // Validate that the rating is a number and within the valid range
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return errorResponse(res, 400, "Rating must be a number between 1 and 5", "Invalid rating value");
    }

    // Check if the review length is less than 300 characters
    if (reviews.length >= 300) {
      return errorResponse(res, 400, "Review must be less than 300 characters", "Review length too long");
    }

    const user = await getUserById(req.userID);
    const reviewTemplate = {
      userID: req.userID,
      username: user.username,
      rating: rating,
      review: reviews,
      createAt: ts,
    };

    await addReviewToDestination(destinationID, reviewTemplate);

    updateRatingupdateDestinationRating(destinationID);

    successResponse(res, 200, "Review added successfully");
  } catch (error) {

    errorResponse(res, 500, "Error Found", error.message);
  }
};


//Upload Gallery per destination by Id
const uploadImage = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const file = req.file;
    if (!file) {
      return errorResponse(res, 400, "No file uploaded", "File is too large");
    }
    const imageUrl = await uploadImageToGallery(destinationID, file);
    successResponse(res, 201, "Image uploaded successfully", imageUrl);
  } catch (error) {
    errorResponse(res, 500, "Error uploading image", error.message);
  }
};

module.exports = {
  getAllDestinations,
  getDestinationDetails,
  getDestinationReview,
  getDestinationGallery,
  createReview,
  uploadImage,
};
