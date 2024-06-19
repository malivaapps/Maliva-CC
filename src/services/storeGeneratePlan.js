const { Firestore } = require('@google-cloud/firestore');
const { firestoreAuth } = require('../config/authServices')
const firestore = new Firestore(firestoreAuth);

const storeGeneratePlan = async (generateID, generateData) => {
  await firestore.collection('Trip Plan').doc(generateID).set(generateData);
}

module.exports = storeGeneratePlan;
