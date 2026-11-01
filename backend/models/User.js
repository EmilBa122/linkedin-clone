const mongoose = require('mongoose');

const bcrypt = require("bcryptjs");

// Define user schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    // The profile pic for this user is stored in the backend on the directory pics and the name of every 
    // profile pic is unique and it is in the form idextension where the id is the unique id of this user
    // and the extension contains the file extension correspondingly so in the field profile_pic is store 
    // this string
    profile_pic: { type: String, required: false },
    name: { type: String, required: false},
    isAdmin: { type: String, default: '' }
});

// Comparison of candidatePassword with the encrypted password 
// (this line of code was being used in the old version of the log in without the use of the passport library
//  see on the file login.js the comments code lines)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;