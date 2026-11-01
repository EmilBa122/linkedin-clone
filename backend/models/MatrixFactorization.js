const mongoose = require('mongoose');

// This file is being used for the Question 12

// The matrix matrix_X will have size M * N, which M is the number of users and N is the number of posts,
// every cell in this matrix will store a number which is the star value of this post for this user
// so this cell will be identified from the user id and the post id these two ids are unique for every user and post respectively  

// Define a cell of a matrix schema and model
const post__star_value__user_Schema = new mongoose.Schema({
    for_user:  {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    for_post:  {type: mongoose.Schema.Types.ObjectId, ref: "Post", require: true},
    star_value: {type: Number, required: true},
});

const Post__Star_Value__User = mongoose.model('Post__Star_Value__User', post__star_value__user_Schema);

module.exports = Post__Star_Value__User;