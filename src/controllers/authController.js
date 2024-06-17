require("dotenv").config();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");

const { getUserData, addUserData, updateUserData, createSession, checkEmail, dropSession } = require("../services/authDataServices");

const { successResponse, errorResponse } = require("../utils/response");

const MAX_CONSECUTIVE_CHARS = 5;

function hasExcessiveConsecutiveChars(username) {
  for (let i = 0; i < username.length - MAX_CONSECUTIVE_CHARS; i++) {
    let count = 1;
    while (i + 1 < username.length && username[i] === username[i + 1]) {
      count++;
      i++;
    }
    if (count > MAX_CONSECUTIVE_CHARS) {
      return true;
    }
  }
  return false;
}

const updateProfile = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!validator.isLength(username, { min: 3, max: 20 })) {
      throw new Error("Username must be between 3 to 20 characters long");
    }

    if (hasExcessiveConsecutiveChars(username)) {
      throw new Error("Username contains too many consecutive identical characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const userData = { username: username, password: hash };
    await updateUserData(req.userID, userData);
    successResponse(res, 200, "Profile Updated", { username });
  } catch (error) {
    errorResponse(res, 500, "Error Found", error.message);
  }
};

const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!validator.isLength(username, { min: 3, max: 20 })) {
      throw new Error("Username must be between 3 to 20 characters long");
    }

    if (hasExcessiveConsecutiveChars(username)) {
      throw new Error("Username contains too many consecutive identical characters");
    }

    if (!email || !password || !username) {
      res.status(400).json({ error: "Data is not fulfilled" });
    }

    if (!validator.isEmail(email)) {
      throw Error("Invalid Email");
    }

    if (!validator.isStrongPassword(password)) {
      throw Error("Weak Password");
    }
    //Minimum password 8 characters there are lowercase, uppercase, symbols, numbers
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
      successResponse(res, 200, "Login successful", { email, session, username: user.username });
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
  updateProfile,
  signUp,
  signIn,
  logout,
};
