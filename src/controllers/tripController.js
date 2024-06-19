const axios = require('axios');
const { config } = require('../config/authServices')
const storeGeneratePlan = require('../services/storeGeneratePlan');
const { errorResponse, successResponse } = require('../utils/response');
const { v4: uuidv4 } = require("uuid");
const { Firestore } = require('@google-cloud/firestore');
const { firestoreAuth } = require('../config/authServices');
const firestore = new Firestore(firestoreAuth);


const fetchPlannerData = async (query) => {
     const { category, type, child, budget, lat, long, nrec } = query;
     const searchQuery = `category=${category}&type=${type}&child=${child}&budget=${budget}&lat=${lat}&long=${long}&nrec=${nrec}`;
     try {
          const response = await axios.get(`${config.tripPlanModel}/planner?${searchQuery}`);
          return response.data.plan;
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};


const getPlanner = async (req, res) => {
     try {
          const planData = await fetchPlannerData(req.query);
          successResponse(res, 200, "Generate success", { plan: planData });
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};


const getTripPlanByID = async (req, res) => {
     try {
          const UserRef = firestore.collection('Trip Plan');
          const query = UserRef.where('userID', '==', req.userID);
          const tripPlanSnapshot = await query.get();

          const tripPlans = [];
          tripPlanSnapshot.forEach(doc => {
               tripPlans.push({ plan: doc.data().plan });
          });

          successResponse(res, 200, "Success get", { plan: tripPlans });
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};


const saveTripPlan = async (req, res) => {
     try {
          const generateID = uuidv4();
          const planData = await fetchPlannerData(req.query);

          await storeGeneratePlan(generateID, { userID: req.userID, plan: planData });
          successResponse(res, 200, "Success store", { plan: planData });
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};

const deleteTripPlan = async (req, res) => {
     const { generateID } = req.params;

     try {
          const docRef = firestore.collection('Trip Plan').doc(generateID);
          const userDocRef = docRef.collection('users').doc(req.userID);
          const tripPlanSnapshot = await userDocRef.get();


          if (!tripPlanSnapshot.exists) {
               return errorResponse(res, 404, "Not Found", "Trip Plan not found");
          }

          const deleteCollection = async (collectionRef, batchSize = 100) => {
               const snapshot = await collectionRef.limit(batchSize).get();
               if (snapshot.empty) {
                    return;
               }

               const batch = firestore.batch();
               snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
               });

               await batch.commit();

               if (snapshot.size >= batchSize) {
                    return deleteCollection(collectionRef, batchSize);
               }
          };

          const subcollections = await userDocRef.listCollections();
          for (const subcollection of subcollections) {
               await deleteCollection(subcollection);
          }

          await userDocRef.delete();
          await docRef.delete();

          successResponse(res, 200, "Success delete");
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};

module.exports = { getPlanner, saveTripPlan, getTripPlanByID, deleteTripPlan };
