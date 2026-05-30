const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateUserGroup, adminCreateUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/users', protect, adminCreateUser);
router.get('/users', protect, getAllUsers);
router.put('/users/:id/group', protect, updateUserGroup);

module.exports = router;
