const express = require('express');
const Post = require('../models/Post'); 
const Like = require('../models/Like'); 
const Comment = require('../models/Comment');
const Connections = require('../models/Connections');
const app = express.Router();
const path = require('path');
const fs = require('fs');

const { createFriendshipdummy, findFriends } = require('./friends_dummy');
const multer = require('multer');
const Post__Star_Value__User = require('../models/MatrixFactorization');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
        console.log("body 2");
        console.log(file);
        if (file.mimetype.startsWith('image')) 
        {
            upload_Path = 'pictures';
        } 
        else if (file.mimetype.startsWith('video')) 
        {
            upload_Path = 'videos';
        } 
        else if (file.mimetype.startsWith('audio')) 
        {
            upload_Path = 'audios';
        }
        cb(null, upload_Path);
	},
	filename: (req, file, cb) => {
	    cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });

// Endpoint for saving a post whether its has content or one or more multimedia or any combination of the above
// and for every multimedia if it has we tell in which directory this multimedia should be saved and with what name 
app.post('/api/post', upload.array('files'), async (req, res) => {

    console.log("body 1");

    console.log(req.body);
    if (req.user) {
        try {
            const { content } = req.body;
            console.log("!");
            console.log(content);

            const when = new Date();

            // Save post
            const newPost = new Post({ content: content, user: req.user._id, createAt: when});
            await newPost.save();

            var counter = 0;
            // The req.files inside it has the uploaded files if the user upload some files 
            if (req.files)
            {
                var temp_videos_array = [];
                var temp_pictures_array = [];
                var temp_audios_array = [];


                req.files.forEach((file) => {
                    console.log("file");
                    console.log(file);
                    const id = newPost._id.toString();
                    const extension = path.extname(file.originalname);
                    // The name of this multimedia will be id_counter.extension, which id is the unique id of 
                    // this post, counter is a number that indicates the number of this multimedia which has on 
                    // this post and extension is the extension of the multimedia
                    const newFileName = `${id}_${counter}${extension}`;
                    counter++;
                    const newPath = path.join(file.destination, newFileName);
                    fs.renameSync(file.path, newPath);

                    // we save the name of this multimedia to the right array 
                    if (file.destination === 'videos')
                    {
                        temp_videos_array.push(newFileName);
                    }
                    else if (file.destination === 'pictures')
                    {
                        temp_pictures_array.push(newFileName);
                    }
                    else if (file.destination === 'audios')
                    {
                        temp_audios_array.push(newFileName);
                    }
                });

                
                const updateFields = { videos: temp_videos_array, pictures: temp_pictures_array, audios: temp_audios_array};


                // and we update the right one field of the model Post to know for this post what multimedia has
                const updatedPost = await Post.findByIdAndUpdate(
                    newPost._id,
                    { $set: updateFields }, // Use $set to update specific fields
                    { new: true } // Return the updated document
                );

                if (!updatedPost) 
                {
                    console.log("unexpected error");
                    return res.status(404).json({ error: 'Unexpected error' });
                }
            }

            res.status(200).json({ message: 'Post saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'User has not logged in' });
    }
});

// Endpoint for getting a specific posts for a specific user 
app.post('/api/posts', async (req, res) => {
    console.log("hello from this.posts.js");
    if (req.user) {
        // we return for the user with id = req.user._id an array of object Id posts in descending order according 
        // with the value the matrix_factorization has produce for this user and these posts 
        // (i.e. the previous comments reference to the Question 12 of this exercise)
        const stars = await Post__Star_Value__User.find({for_user: req.user._id} ,{"for_post":1, "_id":0}).sort({star_value: -1});
        
        var stars_posts = [];
        if (stars)
        {
            var temp_posts = [];
            for (const star of stars)
            {
                const post = await Post.find({_id: star.for_post}).populate('user'); 
                // console.log(post[0]);
                temp_posts.push(post[0]);
            }

            
            await Promise.all(
                temp_posts.map(async (post) => {

                    // Here we find if that user did a like in that post
                    const liked_post = await Like.find({ from_user: req.user._id, post: post._id });

                    if (liked_post.length === 0) 
                    {
                        post.mycount = 0;
                    } 
                    else 
                    {
                        post.mycount = 1;
                    }

                    stars_posts.push(post);                   
                })
            );
        }

        // Now we have the problem that if a user or a friend of that user create a new post this post will not 
        // be shown directly on the Home Page of that user, we must wait to calculate first the matrix_factorization 
        // so with the below code we find the new posts that have been made from the user or the friends of that 
        // user to display with the posts from above to the Home Page for this user 
        const flag_new_posts = true;
        // I use the flag flag_new_posts because I had come up with a method to fecth posts for the users on the 
        // Question 5 but with the matrix_factorization (Question 12) this tactic I had thought of was no longer 
        // needed so I decided to keep the two of them and seperate them with the use of "if and else"
        if (flag_new_posts)
        {
            try {
                // The new_post is a list that has all posts the user and the friends of that user did
                const new_posts = await get_new_Posts(req.user._id);
                await Promise.all(
                    new_posts.map(async (post) => {
                        // Here we find if that user did a like in that post
                        const liked_post = await Like.find({ from_user: req.user._id, post: post._id });

                        if (liked_post.length === 0) 
                        {
                            post.mycount = 0;
                        } 
                        else 
                        {
                            post.mycount = 1;
                        }

                        // The below lines of code are used to not display the same post more than once 
                        // in the Home Page of every user
                        for (var i = 0; i < stars_posts.length; i++)
                        {
                            if (stars_posts[i]._id.equals(post._id))
                            {
                                stars_posts.splice(i, 1);
                                break;
                            }
                        }
                    })
                );

                const final_posts = new_posts.concat(stars_posts);
                res.status(200).json({ posts: final_posts });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
        else
        {
            // The method I came up to fecth posts for the users on the Question 5
            try {
                // The posts_temp is a list that has all the posts the user did, the posts the friends of that user 
                // did, the posts they liked the friends of that user and the posts which they liked a comment the
                // friends of that user (Αttention the posts_temp most probably has duplicates of a specific post)
                const posts_temp = await getPosts(req.user._id);

                await Promise.all(
                    posts_temp.map(async (post) => {

                        // The below lines of code are used to not display the same post more than once 
                        // in the Home Page of every user
                        var found = false;
                        for (var i = 0; i < stars_posts.length; i++)
                        {
                            if (stars_posts[i]._id.equals(post._id))
                            {
                                found = true;
                                break;
                            }
                        }

                        // Here we find if that user did a like in that post
                        const liked_post = await Like.find({ from_user: req.user._id, post: post._id });

                        if (liked_post.length === 0) 
                        {
                            post.mycount = 0;
                        } 
                        else 
                        {
                            post.mycount = 1;
                        }

                        if (!found)
                            stars_posts.push(post);
                    })
                );
                const all_posts = stars_posts.sort((a, b) => b.createAt - a.createAt);

                all_posts.forEach((post) => {
                    console.log("mesa sthn post");
                    console.log(post.videos[0]);
                });

                console.log(all_posts);
                res.status(200).json({ posts: all_posts });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    } else {
        console.log("not good");
        res.status(401).json({ error: 'User has not logged in' });
    }     
})

const get_new_Posts = async (user_id) => {
    try {
        const posts = await Post.find({user: user_id})
                                .populate('user')   
                                .sort({createAt: -1});

        const friends = await findFriends(user_id);

        console.log("--------------------------------------");
        console.log(friends);
        console.log("--------------------------------------");

        const friends_posts = await Promise.all(
            friends.map(async (friend_id) => {

                const friend_posts = await Post.find({user: friend_id})
                                                .populate('user')
                                                .sort({createAt: -1});
                return friend_posts;                                
            })
        );

        // Now the friends_posts is a list of lists that every list inside it 
        // has all the posts from a specific user 

        // To have a single list of all the posts the friends of that user made
        const list_friends_posts = friends_posts.flat();

        const posts_and_friends_posts = posts.concat(list_friends_posts);

        return posts_and_friends_posts;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }    
};

const getPosts = async (user_id) => {
    try {
        const posts = await Post.find({user: user_id})
                                .populate('user')  
                                .sort({createAt: -1});

        const friends = await findFriends(user_id);

        const friends_posts = await Promise.all(
            friends.map(async (friend_id) => {

                const friend_posts = await Post.find({user: friend_id})
                                                .populate('user') 
                                                .sort({createAt: -1});

                return friend_posts;                                
            })
        );

        // Now the friends_posts is a list of lists that every list inside it 
        // has all the posts from a specific user 

        // To have a single list of all the posts the friends of that user made
        const list_friends_posts = friends_posts.flat();

        const posts_and_friends_posts = posts.concat(list_friends_posts);

        // Here we find the likes from the friends of that user did in posts and comments
        const likes = await Promise.all(
            friends.map(async (friend_id) => {

                const friend_likes = await Like.find({from_user: friend_id});

                return friend_likes;                                
            })
        );

        // Now the likes is a list of lists that every list inside it 
        // has all the likes a specific user did in posts and comments
        console.log(likes);

        // Here we create a list like_posts that it will have all the liked posts 
        // the friends of that user did 
        const like_posts = await Promise.all(
            // First we flat the likes list of lists into a single list that has 
            // all the likes the friends of that user did in posts and comments
            // and we keep only the liked posts
            likes.flat().map(async (like) => {

                const posts = await Post.find({_id: like.post})
                                        .populate('user');   

                return posts;                                
            })
        );

        // Here we create a list like_comments that it will have all the liked comments
        // the friends of that user did 
        const like_comments = await Promise.all(
            // First we flat the likes list of lists into a single list that has 
            // all the likes the friends of that user did in posts and comments
            // and we keep only the liked comments
            likes.flat().map(async (like) => {

                const comments = await Comment.find({_id: like.comment})
                                                .populate('user');
                                               
                return comments;                                
            })
        );

        // Here we find from the like_comments list for every comment inside of it in which post 
        // the comment belongs
        const like_comment_posts = await Promise.all(
            like_comments.flat().map(async (comment) => {

                const posts = await Post.find({_id: comment.post})
                                        .populate('user'); 
                                        
                return posts;                                
            })
        );

        // The final_posts is a list that has all the posts the user did, the posts the friends of that user did,
        // the posts they liked the friends of that user and the posts which they liked a comment 
        // the friends of that user (Αttention the final_posts most probably has duplicates of a specific post)
        const final_posts = posts_and_friends_posts.concat(like_posts.flat(), like_comment_posts.flat());
        return final_posts;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Endpoint for saving a like from a specific user to a specific post
app.post('/api/post/like', upload.none(), async (req, res) => {
    if (req.user) {
        try {
            const { content, post } = req.body;
            console.log("!");
            console.log(post);

            // Save like
            const newLike = new Like({ type: content, from_user: req.user._id, post: post});
            await newLike.save();
            await Post.updateOne( { _id: post },
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

// Endpoint for saving a "dislike" from a specific user to a specific post
app.post('/api/post/dislike', upload.none(), async (req, res) => {
    if (req.user) {
        try {
            const { content, post } = req.body;
            console.log("!");
            console.log(content);

            // Save "dislike"
            await Like.deleteOne({post: post, from_user: req.user._id, type: content})
            await Post.updateOne( { _id: post },
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

module.exports = 
{
    app, 
    getPosts,
};