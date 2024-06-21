const { Firestore } = require("@google-cloud/firestore");
const { firestoreAuth } = require("../config/authServices");
const firestore = new Firestore(firestoreAuth);
const { successResponse, errorResponse } = require("../utils/response");


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

const addDataHistory = async (searchID, dataHistory) => {
  await firestore.collection("SearchHistory").doc(searchID).set(dataHistory);
};

const updateUserData = async (userID, userData) => {
  const usersRef = firestore.collection("Users").doc(userID);
  await usersRef.update(userData);

};

const getProfileById = async (userID) => {
  const usersRef = firestore.collection("Users").doc(userID);
  const snapshot = await usersRef.get();
  if (!snapshot.exists) {
    return null;
  }
  const data = snapshot.data();
  return {
    username: data.username,
    email: data.email
  };
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

const getUserById = async (userID) => {
  const usersRef = firestore.collection("Users").doc(userID);
  const snapshot = await usersRef.get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data();
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

module.exports = { getProfileById, getUserData, getUserById, addDataHistory, addUserData, updateUserData, createSession, getSession, checkEmail, dropSession };
