const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST,
  // googleServiceCreden: JSON.parse(process.env.CREDENTIALS),
  secret: process.env.SECRET_KEY,
  bucketName: process.env.STORAGE_NAME,
};

// const firestoreAuth = {
//   projectId: config.googleServiceCreden.project_Id,
//   credentials: {
//     client_email: config.googleServiceCreden.client_email,
//     private_key: config.googleServiceCreden.private_key
//   }
// }


// const storageAuth = {
//   projectId: config.googleServiceCreden.project_Id,
//   credentials: {
//     client_email: config.googleServiceCreden.client_email,
//     private_key: config.googleServiceCreden.private_key
//   }
}

module.exports = { config, firestoreAuth, storageAuth };
