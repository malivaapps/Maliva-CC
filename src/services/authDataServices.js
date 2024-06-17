const { Firestore } = require("@google-cloud/firestore");
const { firestoreAuth } = require("../config/authServices");
const firestore = new Firestore(firestoreAuth);

const checkEmail = async (email) => {
  const usersRef = firestore.collection("Users");
  const query = usersRef.where("email", "==", email);
  const snapshot = await query.get();

  if (snapshot.empty) {
    return false;
  } else {
    return true;
  }
};

const addUserData = async (userID, userData) => {
  await firestore.collection("Users").doc(userID).set(userData);
};

const updateUserData = async (userID, userData) => {
  const usersRef = firestore.collection("Users").doc(userID);
  await usersRef.update(userData);

};

const getUserData = async (email) => {
  const usersRef = firestore.collection("Users");
  const query = usersRef.where("email", "==", email);

  const snapshot = await query.get();
  if (snapshot.empty) {
    return null;
  }

  let user = null;
  snapshot.forEach((doc) => {
    user = doc.data();
    user.userID = doc.id;
  });
  return user;
};

const createSession = async (sessionID, sessionData) => {
  await firestore.collection("Session").doc(sessionID).set(sessionData);
};

const getSession = async (sessionID) => {
  const sessionRef = firestore.collection("Session").doc(sessionID);
  const snapshot = await sessionRef.get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data();
};

const dropSession = async (sessionID) => {
  const sessionRef = firestore.collection("Session").doc(sessionID);
  await sessionRef.delete();
};

module.exports = { getUserData, addUserData, updateUserData, createSession, getSession, checkEmail, dropSession };
