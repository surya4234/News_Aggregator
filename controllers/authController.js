const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Registration Controller
exports.register = async (req, res, next) => {
  const { first_name, last_name, email, password, confirm_password, phone } = req.body;

  // Validate passwords
  if (password !== confirm_password) {
    return res.status(400).render('register', { errorMessage: 'Passwords do not match' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render('register', { errorMessage: 'Email already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ first_name, last_name, email, password: hashedPassword, phone });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, jwtSecret, { expiresIn: '1h' });

    // Set token in a cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Redirect to dashboard after successful registration
    res.redirect('/user/dashboard');
  } catch (error) {
    console.error(error);
    next(new Error('Server error during registration')); // Forward to error-handling middleware
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // If user does not exist
    if (!user) {
      return res.status(401).render('login', { errorMessage: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', { errorMessage: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    // Set token in a cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Redirect to dashboard after successful login
    res.redirect('/user/dashboard');
  } catch (error) {
    console.error(error);
    next(new Error('Server error during login')); // Forward to error-handling middleware
  }
};
