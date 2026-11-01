const mongoose = require('mongoose');

// Define post schema and model
const postSchema = new mongoose.Schema({
    content: { type: String, required: false},
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
    // The field mycount indicates whether the user who created this post has liked their own post
    mycount: {type: Number, required: true, default: 0},
    // The field count contains the number of likes that were made on this post
    count: {type: Number, required: true, default: 0},
    // The field pictures is an array that has all the names of the pictures in the case that this post had any 
    // pictures (the pictures are stored in the backend on the directory pictures) the name of every picture is 
    // unique and it is in the form id_counterextension where the id is the id of this post, the counter is a number 
    // that indicates the number of this file on this post and the extension contains the file extension correspondingly
    pictures: { type: [String], required: false },
    // The field audios is an array that has all the names of the audios in the case that this post had any audios
    // (the audios are stored in the backend on the directory audios) and for the name of every audio I follow 
    // the same logic as on the field pictures
    audios: {type: [String], required: false },
    // The field videos is an array that has all the names of the videos in the case that this post had any videos
    // (the videos are stored in the backend on the directory videos) and for the name of every video I follow 
    // the same logic as on the field pictures
    videos: {type: [String], required: false },
    createAt:   { type: mongoose.SchemaTypes.Date, require: true},
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;