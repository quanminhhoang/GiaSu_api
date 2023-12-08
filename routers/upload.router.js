const router = require("express").Router();
const Multer = require("multer");

const UploadController = require('../controllers/uploadController')

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

router.post('/upload-image', upload.single("avatar"), UploadController.uploadImage )

module.exports = router;