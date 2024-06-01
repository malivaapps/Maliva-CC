// Parse environment variables for Firestore and Storage credentials
const firestoreCredentials = JSON.parse(process.env.CREDENTIALS_FIRESTORE);
const storageCredentials = JSON.parse(process.env.CREDENTIALS_STORAGE);

// Firestore authentication configuration
const firestoreAuth = {
  projectId: firestoreCredentials.project_Id,
  credentials: {
    client_email: firestoreCredentials.client_email,
    private_key: firestoreCredentials.private_key
  }
}

// Storage authentication configuration
const storageAuth = {
  projectId: storageCredentials.project_Id,
  credentials: {
    client_email: storageCredentials.client_email,
    private_key: storageCredentials.private_key
  }
}

// Export the authentication configurations
module.exports = { firestoreAuth, storageAuth };
