const mongoose = require('mongoose');

// A like can be made either on a post or on a comment, which is why Ι use the fields post and comment
// Define like schema and model
const likeSchema = new mongoose.Schema({
    type: {type: String, required: true},
    from_user:  {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    // In the case where this like was made on a post I store the Object Id of that post
    post:  {type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null},
    // In the case where this like was made on a comment I store the Object Id of that comment
    comment:  {type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null},
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;