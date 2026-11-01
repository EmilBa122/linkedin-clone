const express = require('express');
const User = require('../models/User'); // Import the User model
const Comment = require('../models/Comment'); // Import the User model
const Post = require('../models/Post'); // Import the User model
const Connections = require('../models/Connections'); // Import the User model



const app = express.Router();

app.get('/api/admin', async (req,res) => {
    try {
        var id;
        if (req.query.admin === 'undefined'){
            id = req.user._id;
        }
        else{
            id = req.query.admin;
        }

        //console.log('admin',req.query.admin);
        const users = await User.find({ _id: { $ne: id }})
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/admin/getComment', async (req,res) => {
    try {
        var id = req.query.id;

        console.log('id',id);
        const comments = await Comment.find({user: id})
        if (comments.comment === null){
            console.log('u',comments.comment);
        }

        const posts = await Post.find({user: id});

        const friends = await Connections.find({from: id, connect: 1});
        const friends_ = friends.map((friend) => {
            return {
                friend_id: friend.to,
            };
          });
        console.log(friends_);
        res.json([comments,posts,friends_]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/api/admin/update', async (req,res) => {
    try {
        const id = req.query.post_id;
        console.log('update',id);
        const comment_id = req.query.comment_id;
        const update = {
            nested_in_post: id,
        }
        const data = await Comment.findOneAndUpdate({
            _id: comment_id
        }, update,{
            new: true
        }).exec();
        
        if (data) return res.json({ msg: "updated add connection" });
        else return res.json({ msg: "Failed to updata add connection" });

    } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/api/admin/findCommentOnPost', async (req,res) => {
    try {
        var id = req.query.id;

        console.log('id',req.query.id);
        const comment = await Comment.find({ _id: id })
        if (comment.comment === null){
            console.log(null);
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/getNested', async (req,res) => {
    try {
        var id = req.query.id;

        console.log('idd',req.query.id);
        const comment = await Comment.find({ _id: id })
        if (comment.comment === null){
            console.log(null);
        }
        console.log('nested',comment.nested_in_post);

        res.json(comment.nested_in_post);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;