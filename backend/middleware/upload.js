const multer = require('multer');

const storage = multer.memoryStorage(); // use buffer

const upload = multer({ storage });

module.exports = upload;
