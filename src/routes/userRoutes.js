const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const matchingService = require('../services/matchingService');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../public/uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/profile', auth, userController.getProfile);
router.get('/profile/:id', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/profile/picture', auth, upload.single('picture'), userController.uploadProfilePicture);
router.get('/search', auth, userController.searchUsers);
router.post('/block/:userId', auth, userController.blockUser);
router.delete('/block/:userId', auth, userController.unblockUser);
router.get('/blocked', auth, userController.getBlockedUsers);
router.get('/matches', auth, async (req, res) => {
  try {
    const matches = await matchingService.findMatches(req.user.id);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: 'Failed.' });
  }
});

module.exports = router;
