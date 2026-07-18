const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  me,
  updateProfile
} = require('../controllers/auth.controller.js');
const { requireAuth } = require('../middleware/auth.js');


router.post('/register', register);


router.post('/login', login);


router.post('/logout', logout);


router.get('/me', requireAuth, me);


router.put('/profile', requireAuth, updateProfile);

module.exports = router;
