const axios = require('axios');
const { config } = require('../config/authServices');
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
          throw new Error(error.message);
     }
};

const getPlanner = async (req, res) => {
     try {
          const { title } = req.params;
          const planData = await fetchPlannerData(req.query);
          successResponse(res, 200, "Generate success", { title: title, plan: planData });
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};

const getTripPlanByID = async (req, res) => {
     try {
          const userRef = firestore.collection('Trip Plan');
          const query = userRef.where('userID', '==', req.userID);
          const tripPlanSnapshot = await query.get();

          const tripPlans = [];
          tripPlanSnapshot.forEach(doc => {
               tripPlans.push({ id: doc.id, title: doc.data().title, plan: doc.data().plan });
          });

          successResponse(res, 200, "Success get", tripPlans);
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};

const saveTripPlan = async (req, res) => {
     try {
          const { title } = req.query;
          const generateID = uuidv4();
          const planData = await fetchPlannerData(req.query);
          await storeGeneratePlan(generateID, { title: title, userID: req.userID, plan: planData });
          successResponse(res, 200, "Success store", { plan: planData });
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};

const deleteTripPlan = async (req, res) => {
     const { generateID } = req.params;

     try {
          const docRef = firestore.collection('Trip Plan').doc(generateID);
          const tripPlanSnapshot = await docRef.get();

          if (!tripPlanSnapshot.exists) {
               return errorResponse(res, 404, "Not Found", "Trip Plan not found");
          }

          await docRef.delete();
          successResponse(res, 200, "Success delete");
     } catch (error) {
          errorResponse(res, 500, "Error Found", error.message);
     }
};

module.exports = { getPlanner, saveTripPlan, getTripPlanByID, deleteTripPlan };
