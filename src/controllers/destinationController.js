const { getAllData, getDataById, getReviewsByDestinationId, addReviewToDestination, uploadImageToGallery } = require("../services/getData")
const getAllDestinations = async (req, res) => {
  try {
    const destinations = await getAllData();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

const getDestinationDetails = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const destination = await getDataById(destinationID);
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDestinationReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const reviews = await getReviewsByDestinationId(destinationID);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};


const createReview = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const { reviews } = req.body;
    const ts = new Date().getTime();
    const reviewTemplate = {
      "createAt": ts,
      "review": reviews
    }
    await addReviewToDestination(destinationID, reviewTemplate);
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const { destinationID } = req.params;
    const file = req.file;
    const imageUrl = await uploadImageToGallery(destinationID, file);
    res.status(201).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllDestinations, getDestinationDetails, getDestinationReview, createReview, uploadImage };