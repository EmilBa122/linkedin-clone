const express = require('express');
const Comment = require('../models/Comment'); 
const Like = require('../models/Like'); 
const app = express.Router();

// Endpoint for saving a comment
app.post('/api/comment', async (req, res) => {
    if (req.user) {
        try {
            const { content, post_key } = req.body;
            console.log("!");
            console.log(content);

            const when = new Date();

            // Save comment
            const newComment = new Comment({ content: content, user: req.user._id, createAt: when, post:post_key});
            await newComment.save();

            res.status(200).json({ message: 'Comment saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

// Endpoint for getting all the comments (not the "nested" comments) from a specific post
app.post('/api/comments', async (req, res) => {
    if (req.user) {
        try {
            const { post_key } = req.body;
            console.log(post_key);
            const comments = await Comment.find({post: post_key})
                                    // We want the full User model data in the user field not just the id of that user
                                    // (because without the populate the user indicates to the user id)
                                    .populate('user') 
                                    // same as above we want the full Post model data in the post field 
                                    .populate('post')
                                    .sort({createAt: -1});

            await Promise.all(
                comments.map(async (comment) => {

                    // Here we find if that user did a like in that post
                    const liked_comment = await Like.find({ from_user: req.user._id, comment: comment._id });

                    if (liked_comment.length === 0) 
                    {
                        comment.mycount = 0;
                    } 
                    else 
                    {
                        comment.mycount = 1;
                    }  
                })
            );
                                                
            // console.log(comments[0]);
            res.status(200).json({ comments: comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        console.log("not good");
        res.status(401).json({ error: 'User has not logged in' });
    }
})

// Endpoint for saving a "nested" comment
app.post('/api/comment_to_comment', async (req, res) => {
    if (req.user) {
        try {
            const { content, comment_key: comment_key } = req.body;
            console.log("!");
            console.log(content);

            const when = new Date();

            // Save comment
            const newComment = new Comment({ content: content, user: req.user._id, createAt: when, comment:comment_key});
            await newComment.save();

            res.status(200).json({ message: 'Comment saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

// Endpoint for getting all the "nested" comments for the comment with id equal to comment_key
app.post('/api/comments_to_comments', async (req, res) => {
    if (req.user) {
        try {
            const { comment_key: comment_key } = req.body;
            console.log(comment_key);
            const comments = await Comment.find({comment: comment_key})
                                    .populate('user')
                                    .populate('comment')
                                    .sort({createAt: -1});

            await Promise.all(
                comments.map(async (comment) => {

                    // Here we find if that user did a like in that comment_to_comment
                    const liked_comment = await Like.find({ from_user: req.user._id, comment: comment._id });

                    if (liked_comment.length === 0) 
                    {
                        comment.mycount = 0;
                    } 
                    else 
                    {
                        comment.mycount = 1;
                    }  
                })
            );
            // console.log(comments[0]);
            res.status(200).json({ comments: comments });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        console.log("not good");
        res.status(401).json({ error: 'User has not logged in' });
    }
})

// Endpoint for saving a like from a specific user to a specific not "nested" comment 
app.post('/api/comment/like', async (req, res) => {
    if (req.user) {
        try {
            const { content, comment} = req.body;
            console.log("!");
            console.log(comment);

            // Save like
            const newLike = new Like({ type: content, from_user: req.user._id, comment: comment});
            await newLike.save();
            await Comment.updateOne( { _id: comment },
                {
                 
                    $inc: {'count': 1}
                 
                  
                })

            res.status(200).json({ message: 'Like saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

// Endpoint for saving a "dislike" from a specific user to a specific not "nested" comment
app.post('/api/comment/dislike', async (req, res) => {
    if (req.user) {
        try {
            const { content, comment } = req.body;
            console.log("!");
            console.log(content);

            // Save "dislike"
            await Like.deleteOne({comment: comment, from_user: req.user._id, type: content})
            await Comment.updateOne( { _id: comment },
                {
                 
                    $inc: {'count': -1}
                 
                  
                })

            res.status(200).json({ message: 'Like saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

// Endpoint for saving a like from a specific user to a specific "nested" comment
app.post('/api/comment_to_comment/like', async (req, res) => {
    if (req.user) {
        try {
            const { content, comment} = req.body;
            console.log("!");
            console.log(comment);

            // Save like
            const newLike = new Like({ type: content, from_user: req.user._id, comment: comment});
            await newLike.save();
            await Comment.updateOne( { _id: comment },
                {
                 
                    $inc: {'count': 1}
                 
                  
                })

            res.status(200).json({ message: 'Like saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

// Endpoint for saving a "dislike" from a specific user to a specific "nested" comment
app.post('/api/comment_to_comment/dislike', async (req, res) => {
    if (req.user) {
        try {
            const { content, comment } = req.body;
            console.log("!");
            console.log(content);

            // Save "dislike"
            await Like.deleteOne({comment: comment, from_user: req.user._id, type: content})
            await Comment.updateOne( { _id: comment },
                {
                 
                    $inc: {'count': -1}
                 
                  
                })

            res.status(200).json({ message: 'Like saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

module.exports = app;