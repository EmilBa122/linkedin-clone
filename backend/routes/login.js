const express = require('express');
const passport = require('passport');
// const User = require('../models/User'); // Import the User model

const app = express.Router();

const ensureAuthenticated = require('../middleware/AuthMiddleware');

// Login User
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) return res.status(400).json({ error: info.message });
    req.logIn(user, err => {
        if (err) throw err;
        res.json({ error: 'Logged in successfully', user });
    });
  })(req, res, next);
});

// Get current user
app.get('/api/user', ensureAuthenticated, (req, res) => {
  console.log('login');
  console.log(req.user);
  res.json({ user: req.user });
});

// Endpoint for user login (old version without using the passport library)
// app.post('/api/login', async (req, res) => {
//     try {
//       const { password, email, first_name, last_name, phone_number } = req.body;
      
//       // Check if email already exists
//       const user = await User.findOne({ email });
//       if (!user) 
//       {
//         return res.status(400).json({ error: 'Email does not exists' });
//       }
//       // Compare the provided password with the stored hashed password
//       const isMatch = await user.comparePassword(password);
//       if (!isMatch) 
//       {
//         return res.status(400).json({ error: 'Invalid email or password' });
//       }
//       // Set session data (e.g., logged-in user)
//       req.session.user = user;
//       console.log(req.session.user);
      
//       res.status(201).json({ message: 'User logged in successfully' });
// 	  } catch (error) {
// 		  console.error(error);
// 		  res.status(500).json({ error: 'Internal server error' });
// 	  }
// });

// Logout endpoint
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) 
      {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid'); 
      res.redirect('https://localhost:443'); 
    });
});

module.exports = app;