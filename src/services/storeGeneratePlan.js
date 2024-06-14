const { Firestore } = require('@google-cloud/firestore');
const { firestoreAuth } = require('../config/authServices')

async function storeGeneratePlan(id, data) {
  const firestore = new Firestore(firestoreAuth);

  const docRef = firestore.collection('generate').doc(id);
  await docRef.set(data);
}

module.exports = storeGeneratePlan;
