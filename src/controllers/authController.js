const { Firestore } = require('@google-cloud/firestore');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid')

const firestore = new Firestore({
     projectId: "submissionmlgc-rahmatrohmani",
     keyFilename: "asdasdasdadasdasd",
});

const createToken = (credential_id) => {
     return jwt.sign({ credential_id }, process.env.SECRET_KEY, { expiresIn: '3d' })
}

const signUp = async (req, res) => {
     const { username, email, password } = req.body // memperoleh data email, password , username
     try {
          if (!email || !password || !username) { //memastikan data lengkap
               res.status(400).json({ error: "Fields harus diisi" })
          }

          const userId = nanoid.nanoid(30)
          // const timestamp = Date.now()
          // const salt = await bcrypt.genSalt(10)
          // const hash = await bcrypt.hash(password, salt)


          const token = createToken(userId)
          res.status(200).json({ email: email, token: token })
     }
     catch (error) {
          res.status(400).json({ error: error.message })
     }
}

const signIn = async (req, res) => {
     const { email, password } = req.body
     const usersRef = firestore.collection('users');
     const query = usersRef.where('email', '==', email);

     try {
          const snapshot = await query.get();

          if (snapshot.empty) {
               console.log('No matching documents.');
               res.json({ success: false, message: 'User not found' })
          }

          let user = null;
          snapshot.forEach(doc => {
               user = doc.data();
               user.id = doc.id;
          });

          if (user && await bcrypt.compare(password, user.password)) {
               console.log('Login successful');
               res.json({ success: true, message: 'Login successful', user: user })
          } else {
               console.log('Invalid password');
               res.json({ success: false, message: 'Invalid password' })
          }
     } catch (error) {
          console.error('Error getting documents: ', error);
          res.json({ success: false, message: 'Error occurred'})
     }
}

module.exports = {
     signUp,
     signIn
}