const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const { firestoreAuth, storageAuth } = require('../config/authServices')
// Auth permission Firestore
const firestore = new Firestore(firestoreAuth);
const storage = new Storage(storageAuth);

const bucket = storage.bucket('lake_images'); //testing Bucket 

//FIX Code

const getAllData = async () => {
  const snapshot = await firestore.collection('Destinations').get();
  if (snapshot.empty) {
    return [];
  }

  let destinations = [];
  snapshot.forEach(doc => {
    destinations.push({ id: doc.id, ...doc.data() });
  });

  return destinations;
};

const getDataById = async (id) => {
  const doc = await firestore.collection('Destinations').doc(id).get();
  if (!doc.exists) {
    throw new Error('Destination not found');
  }

  return { id: doc.id, ...doc.data() };
};

const getReviewsByDestinationId = async (destinationID) => {
  const snapshot = await firestore.collection('Destinations').doc(destinationID).collection('Reviews').get();
  if (snapshot.empty) {
    return [];
  }

  let reviews = [];
  snapshot.forEach(doc => {
    reviews.push({ id: doc.id, ...doc.data() });
  });

  return reviews;
};

// FIX Code

const addReviewToDestination = async (destinationID, reviews) => {
  await firestore.collection('Destinations').doc(destinationID).collection('Reviews').add(reviews);
};

const uploadImageToGallery = async (destinationID, file) => {
  const destinationRef = firestore.collection('Destinations').doc(destinationID);
  const destinationDoc = await destinationRef.get();

  if (!destinationDoc.exists) {
    throw new Error('Destination not found');
  }

  const blob = bucket.file(`${destinationID}/gallery/${file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    await destinationRef.collection('Gallery').add({ url: publicUrl });
  });

  blobStream.end(file.buffer);

  return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
};


module.exports = { getAllData, getDataById, getReviewsByDestinationId, addReviewToDestination, uploadImageToGallery };

