require("dotenv").config();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");

const { addUserData, getUserData, createSession, checkEmail, dropSession } = require("../services/authDataServices");

const { successResponse, errorResponse } = require("../utils/response");

const userProfile = async (req, res) => {
  const email = req.query.email; // Assuming email is passed as a query parameter
  try {
    if (!email) {
      return errorResponse(res, 400, "Email query parameter is required");
    }
    const user = await getUserData(email);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    successResponse(res, 200, "Successfully retrieved user data", user);
  } catch (error) {
    errorResponse(res, 500, "Error retrieving user data", error.message);
  }
};

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!email || !password || !username) {
      res.status(400).json({ error: "Data is not fulfilled" });
    }
    if (!validator.isEmail(email)) {
      throw Error("Invalid Email");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error("Weak Password");
    } //Minimum password 8 characters there are lowercase, uppercase, symbols, numbers
    const exists = await checkEmail(email);
    if (!exists) {
      const userID = uuidv4();
      const ts = new Date().getTime();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const userData = { username: username, email: email, password: hash, createdAt: ts };
      await addUserData(userID, userData);
      successResponse(res, 200, "Registration Success", { email, username });
    } else {
      errorResponse(res, 401, "Email Invalid", "Email is already in use");
    }
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserData(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const session = uuidv4();
      const ts = new Date().getTime();
      const sessionData = { email, userID: user.userID, loginTime: ts };
      await createSession(session, sessionData);
      successResponse(res, 200, "Login successful", { email, session });
    } else {
      errorResponse(res, 401, "Client Error", "Email or Password is Invalid");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await dropSession(req.session);
    successResponse(res, 200, "Logout success");
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
};

module.exports = {
  userProfile,
  signUp,
  signIn,
  logout,
};
