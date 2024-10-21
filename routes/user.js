const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const userController = require('../controllers/userController');

// Protected route: Only accessible with a valid JWT
router.get('/profile', authenticateJWT, userController.getProfile);

module.exports = router;
