const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

module.exports = router;