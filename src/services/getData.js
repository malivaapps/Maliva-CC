const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const { firestoreAuth, storageAuth } = require('../config/authServices');

// Auth permission Firestore
const firestore = new Firestore(firestoreAuth);
const storage = new Storage(storageAuth);

const bucket = storage.bucket('lake_images'); //named Bucket 

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

const getGalleryByDestinationId = async (destinationID) => {
  const snapshot = await firestore.collection('Destinations').doc(destinationID).collection('Gallery').get();
  if (snapshot.empty) {
    return []
  }

  let gallery = [];
  snapshot.forEach(doc => {
    gallery.push({ id: doc.id, ...doc.data() });
  });
  return gallery;
}

const addReviewToDestination = async (destinationID, reviews) => {
  await firestore.collection('Destinations').doc(destinationID).collection('Reviews').add(reviews);
};

const updateRatingupdateDestinationRating = async (destinationID) => {
  const destinationRef = firestore.collection('Destinations').doc(destinationID);
  const reviewsRef = await firestore.collection('Destinations').doc(destinationID).collection('Reviews');

  const reviewsSnapshot = await reviewsRef.get();
  if (reviewsSnapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  let totalRating = 0;
  let reviewCount = 0;

  reviewsSnapshot.forEach(doc => {
    totalRating += doc.data().rating;
    reviewCount++;
  });

  const newRating = totalRating / reviewCount;

  await destinationRef.update({ Rating: newRating });

  console.log(`Updated destination ${destinationID} rating to ${newRating}`);
};

const uploadImageToGallery = async (destinationID, file) => {
  const destinationRef = firestore.collection('Destinations').doc(destinationID);
  const destinationDoc = await destinationRef.get();

  if (!destinationDoc.exists) {
    throw new Error('Destination not found');
  }

  const timestamp = new Date().getTime();
  const uniqueFileName = `${timestamp}-${file.originalname}`;

  const blobName = `${destinationID}/gallery/${uniqueFileName}`;
  const blob = bucket.file(blobName);
  await blob.save(file.buffer, {
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blobName}`;
  await destinationRef.collection('Gallery').add({ url: publicUrl });

  return publicUrl;
};


module.exports = {
  getAllData,
  getDataById,
  getReviewsByDestinationId,
  getGalleryByDestinationId,
  addReviewToDestination,
  updateRatingupdateDestinationRating,
  uploadImageToGallery
};

