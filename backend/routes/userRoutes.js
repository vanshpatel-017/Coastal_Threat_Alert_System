const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/logout',auth,logout);


router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    console.error('(CodeRed)Error fetching users:', err);
    res.status(500).json({ message: '(CodeRed) Failed to fetch users' });
  }
});

module.exports = router;
