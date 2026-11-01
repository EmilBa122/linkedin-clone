const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User'); // Import the User model

// for crypt password
const bcrypt = require('bcryptjs');

const app = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	    cb(null, 'pics'); // No error, and the destination is pics directory
	},
	filename: (req, file, cb) => {
	    // The filename will be set later after creating the user
	    cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

// API endpoint for user registration
app.post('/api/register', upload.single('profile_pic'), async (req, res, next) => {
	try {
		const { password, email, first_name, last_name, phone_number } = req.body;
		
		// Check if email already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) 
		{
			return res.status(400).json({ error: 'Email already exists' });
		}
		
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

		//save user
		const newUser = new User({ email, password: hashedPassword, first_name, last_name, phone_number, profile_pic: '', 
			name: first_name  + ' ' + last_name
		});
		await newUser.save();
		
		var name;

		// if the user chose a picture as a profile pic
		if (req.file) 
		{
			// We create a new name for this pic file and we rename it with that name
			// We rename the pic file to id.something where the id it is unique for each user
			// set file name part	
			const id = newUser._id.toString();
			const extension = path.extname(req.file.originalname);
			const newFileName = `${id}${extension}`;
			name = newFileName;
			const newPath = path.join(req.file.destination, newFileName);
			fs.renameSync(req.file.path, newPath);
			
			// I save into the database the new file name on the profile pic
			// update mongodb part
			const updatedUser = await User.findOneAndUpdate(
	            { _id: id },
	            { $set: { profile_pic: newFileName } },
	            { new: true } // Return updated document
	        );
			
			if (!updatedUser) 
			{
				console.log("unexpected error");
	            return res.status(404).json({ error: 'Unexpected error' });
	        }
			
		}
		// if the user didnt choose a profile pic this user will take a default picture we had as a profile pic
		// this default pic we have is on the backend directory inside of the directory Default  
		else
		{
			// We create a new name for this pic file and we rename it with that name
			// We rename the pic file to id.something where the id it is unique for each user
			// set file name part	
			const id = newUser._id.toString();
			const newFileName = `${id}.jpg`;
			const newPath = path.join("pics/", newFileName);
			fs.copyFileSync("Default/default.jpg", newPath);
			
			// I save into the database the new file name on the profile pic
			// update mongodb part
			const updatedUser = await User.findOneAndUpdate(
	            { _id: id },
	            { $set: { profile_pic: newFileName } },
	            { new: true } // Return updated document
	        );
			
			if (!updatedUser) 
			{
				console.log("unexpected error");
	            return res.status(404).json({ error: 'Unexpected error' });
	        }
		}

		console.log('registered');

		// Authenticate the user with passport immediately after registration
		passport.authenticate('local', (err, user, info) => {
			if (err) 
			{
				console.error('Authentication error:', err);
				return res.status(500).json({ error: 'Authentication error' }); // Handle any error that occurs during authentication
			}
			if (!user) 
			{
				return res.status(400).json({ error: info.message }); // Handle case where user is not found
			}

			req.logIn(user, (err) => {
				if (err) 
				{
					console.error('Login error:', err);
					return res.status(500).json({ error: 'Login error' }); // Handle any error that occurs during login
				}
				console.log('logged in');
				// Respond with user data and a success message
				res.status(200).json({ message: 'User registered and logged in successfully', user });
			});
		})(req, res, next);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = app;