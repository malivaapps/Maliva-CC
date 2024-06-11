const multer = require('multer');

const storage = multer.memoryStorage();

const maxSize = 2 * 1024 * 1024; // 2 MB

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
}).single('image');


const requireUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size cannot be more than 2MB" });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = requireUpload;
