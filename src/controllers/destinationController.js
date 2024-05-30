const { Firestore } = require('@google-cloud/firestore');

async function getData(id, data) {
  const firestore = new Firestore({
    projectId: "submissionmlgc-rahmatrohmani",
    keyFilename: ,
  });

  const docRef = firestore.collection('generate').doc(id);
  await docRef.set(data);
}