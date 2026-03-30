const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Apply auth middleware to all routes
router.use(auth);

router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);

module.exports = router;
