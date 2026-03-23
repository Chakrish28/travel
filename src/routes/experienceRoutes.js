const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const experienceController = require('../controllers/experienceController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../public/uploads')),
  filename: (req, file, cb) => cb(null, `exp-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', auth, upload.array('photos', 10), experienceController.createExperience);
router.get('/my', auth, experienceController.getMyExperiences);
router.get('/all', auth, experienceController.getAllExperiences);
router.get('/user/:userId', auth, experienceController.getUserExperiences);
router.put('/:id', auth, upload.array('photos', 10), experienceController.updateExperience);
router.delete('/:id', auth, experienceController.deleteExperience);
router.post('/report', auth, experienceController.reportUser);

module.exports = router;
