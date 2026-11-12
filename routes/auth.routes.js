const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check-email', authController.checkEmail);
router.get('/me', authenticate, authController.getMe);
router.get('/users', authenticate, authorizeAdmin, authController.getUsers);

module.exports = router;
