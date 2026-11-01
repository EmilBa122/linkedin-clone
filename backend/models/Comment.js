const mongoose = require('mongoose');

// A comment can be made either on a post or on a comment, which is why Ι use the fields post and comment
// Define comment schema and model
const commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    user:  {type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    // In the case where this comment was made on a post I store the Object Id of that post
    post:  {type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null},
    // In the case where this comment was made on a comment I store the Object Id of that comment
    comment:  {type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null},
    // The field mycount indicates whether the user who created this comment has liked their own comment
    mycount: {type: Number, required: true, default: 0},
    // The field count contains the number of likes that were made on this comment
    count: {type: Number, required: true, default: 0},
    createAt:  {type: mongoose.SchemaTypes.Date, require: true},
    nested_in_post:  {type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null},
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;