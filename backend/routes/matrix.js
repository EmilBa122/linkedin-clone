const express = require('express');
const User = require('../models/User'); // Import the User model
const fs = require('fs');
const path = require('path');
const {faker} = require('@faker-js/faker');
const app = express.Router();
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const Connections = require('../models/Connections');
const Comment = require('../models/Comment');
const Post__Star_Value__User = require('../models/MatrixFactorization');

const x = require('./post.js'); 
const Like = require('../models/Like.js');

const insert_users = async ( email, password , first_name, last_name, phone_number, profile_pic, name ) => {
    try {
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //save user
        const newUser = new User({ email, password: hashedPassword, first_name, last_name, phone_number, profile_pic: '', name});
        await newUser.save();
        
        // Define the source and destination folders
        const sourceFolder = path.join(__dirname, '../database/pics');
        const destinationFolder = path.join(__dirname, '../pics'); 

        const sourceFile = path.join(sourceFolder, profile_pic);
        // We create a new name for this pic file and we rename it with that name
        // We rename the pic file to id.something where the id it is unique for each user
        // set file name part	
        const id = newUser._id.toString();
        const extension = path.extname(profile_pic);
        const newFileName = `${id}${extension}`;
        const destinationFile = path.join(destinationFolder, newFileName);

        fs.copyFile(sourceFile, destinationFile, (err) => {
            if (err) 
            {
                return res.status(500).send('Error copying file');
            }
        });
    

        // I save into the database the new file name on the profile pic
        // update mongodb part
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: { profile_pic: newFileName } },
            { new: true } // Return updated document
        );
        
        if (!updatedUser) 
        {
            return res.status(404).json({ error: 'Unexpected error' });
        }
        return updatedUser;
    } catch (error) {
        
    }  
}

const save_post = async (user, content, picture_array, videos_array, audios_array) => {

    const when = new Date();

    // Save post
    const newPost = new Post({ content: content, user: user._id, createAt: when});
    await newPost.save();

    var temp_videos_array = [];
    var temp_pictures_array = [];
    var temp_audios_array = [];

    var counter = 0;

    picture_array.forEach((file) => {
        const id = newPost._id.toString();
        const extension = path.extname(file);
        const newFileName = `${id}_${counter}${extension}`;
        counter++;
        
        // Define the source and destination folders
        const sourceFolder = path.join(__dirname, '../database/pictures'); 
        const destinationFolder = path.join(__dirname, '../pictures'); 

        const sourceFile = path.join(sourceFolder, file);	
    
        const destinationFile = path.join(destinationFolder, newFileName);

        fs.copyFile(sourceFile, destinationFile, (err) => {
            if (err) 
            {
                return res.status(500).send('Error copying file');
            }
        });

        temp_pictures_array.push(newFileName);
                
    });

    counter = 0;

    videos_array.forEach((file) => {
        const id = newPost._id.toString();
        const extension = path.extname(file);
        const newFileName = `${id}_${counter}${extension}`;
        counter++;
        
        // Define the source and destination folders
        const sourceFolder = path.join(__dirname, '../database/videos'); 
        const destinationFolder = path.join(__dirname, '../videos');

        const sourceFile = path.join(sourceFolder, file);
    
        const destinationFile = path.join(destinationFolder, newFileName);

        fs.copyFile(sourceFile, destinationFile, (err) => {
            if (err) 
            {
                return res.status(500).send('Error copying file');
            }
        });

        temp_videos_array.push(newFileName);
           
    });

    counter = 0;

    audios_array.forEach((file) => {
        const id = newPost._id.toString();
        const extension = path.extname(file);
        const newFileName = `${id}_${counter}${extension}`;
        counter++;
        
        // Define the source and destination folders
        const sourceFolder = path.join(__dirname, '../database/audios'); 
        const destinationFolder = path.join(__dirname, '../audios'); 

        const sourceFile = path.join(sourceFolder, file);
    
        const destinationFile = path.join(destinationFolder, newFileName);

        fs.copyFile(sourceFile, destinationFile, (err) => {
            if (err) 
            {
                return res.status(500).send('Error copying file');
            }
        });

        temp_audios_array.push(newFileName);
        
    });
        

    const updateFields = { videos: temp_videos_array, pictures: temp_pictures_array, audios: temp_audios_array};


    const updatedPost = await Post.findByIdAndUpdate(
        newPost._id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // Return the updated document
    );

    if (!updatedPost) 
    {
        return res.status(404).json({ error: 'Unexpected error' });
    }  
}

const insert_posts = async (user) =>
{
    const content = faker.lorem.paragraph({ min: 0, max: 3 });
    const pictures_length = Math.floor(Math.random() * 4);
    const picture_array = new Array();
    for (var i = 0; i < pictures_length; i++)
    {
        picture_array.push(Math.floor(Math.random() * 26) + 1 + '.jpg'); 
    }

    const videos_length = Math.floor(Math.random() * 2);
    const videos_array = new Array();
    for (var i = 0; i < videos_length; i++)
    {
        videos_array.push(Math.floor(Math.random() * 7) + 1 + '.mp4'); 
    }

    const audios_length = Math.floor(Math.random() * 2);
    const audios_array = new Array();
    for (var i = 0; i < audios_length; i++)
    {
        audios_array.push('1.mp3'); 
    }

    if (picture_array.length || videos_array.length || audios_array.length || content.length)
        await save_post(user, content, picture_array, videos_array, audios_array);
}

const rm = async (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) 
        {
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directory, file);

            fs.unlink(filePath, (err) => {
                if (err) 
                {
                    //console.error(`Error deleting file: ${file}, ${err}`);
                } else 
                {
                    //console.log(`Deleted: ${file}`);
                }
            });
        });
    });
}

const make_random_friends = async (users) => {

    await Connections.deleteMany({});
    for (const user of users)
    {
        const number_of_friends = Math.floor(Math.random() * 6);
        
        for (var i = 0; i < number_of_friends; i++)
        {
            const user_i = users[Math.floor(Math.random() * users.length)];

            console.log("--------------------------");
            console.log(user);
            console.log(user_i);
            console.log("--------------------------");
            if (user.equals(user_i))
            {
                i--;
                continue;
            }

            const exist_friendship = await Connections.find({
                $or: [
                    { from: user, to: user_i },
                    { from: user_i, to: user }
                ],
                connect: 1
            });

            if (!exist_friendship.length)
            {
                const friends_user_to_user_i = new Connections({from:user, to:user_i, sender: user, connect: 1});
                await friends_user_to_user_i.save();
                const friends_user_i_to_user = new Connections({from:user_i, to:user, sender: user_i, connect: 1});
                await friends_user_i_to_user.save();
            }           
        }
    }
}

const make_comments_from_user = async (users) => {

    await Comment.deleteMany({});
    for (const user of users)
    {
        const posts = await x.getPosts(user);

        const unique_posts = posts.filter((post, index, self) => {
            return index === self.findIndex((p) => p._id === post._id);
        });

        const number_of_comments = Math.floor(Math.random() * 6);

        for (var i = 0; i < number_of_comments; i++)
        {
            const post_i = unique_posts[Math.floor(Math.random() * posts.length)];

            const content = faker.lorem.paragraph({ min: 1, max: 3 });

            const when = new Date();
            
            const new_comment = new Comment({content: content, user: user, post: post_i._id, createAt: when});
            await new_comment.save();
        }
    }
}

const comment_to_comment_from_user = async (users) => {

    for (const user of users)
    {
        const posts = await x.getPosts(user);

        const unique_posts = posts.filter((post, index, self) => {
            return index === self.findIndex((p) => p._id === post._id);
        });
        
        if (posts.length)
        {
            const number_of_comments = Math.floor(Math.random() * 3);
            console.log("number of comments = " + number_of_comments);
            for (var i = 0, count = 0; i < number_of_comments && count < unique_posts.length; i++, count++)
            {
                const post_i = unique_posts[Math.floor(Math.random() * unique_posts.length)];

                const comments = await Comment.find({post: post_i._id});
                
                if (comments.length)
                {
                    const comment_i = comments[Math.floor(Math.random() * comments.length)];

                    const content = faker.lorem.paragraph({ min: 1, max: 3 });
        
                    const when = new Date();
                    
                    const new_comment = new Comment({content: content, user: user, comment: comment_i._id, createAt: when});
                    await new_comment.save();
                }
                else
                {
                    i--;
                }
            }
        }
    }
}

const get_comments = async (comment) =>
{
    var comments = new Array();
    const comments_to_comment = await Comment.find({comment: comment._id});
    if ((comments_to_comment).length)
    {
        for (const comment of comments_to_comment)
        {
            comments = comments.concat(await get_comments(comment)).flat();
        }
    }
    comments = comments.concat(comments_to_comment);
    return comments;
}

const make_like_post_and_comment = async (users) =>
{
    await Like.deleteMany({});
    for (const user of users)
    {
        const posts = await x.getPosts(user);

        const unique_posts = posts.filter((post, index, self) => {
            return index === self.findIndex((p) => p._id === post._id);
        });

        const number_of_likes = Math.floor(Math.random() * 6);

        for (var i = 0; i < number_of_likes; i++)
        {
            const flip_coin = Math.random() > 0.5;
            const post_i = unique_posts[Math.floor(Math.random() * unique_posts.length)];
            const comments = await Comment.find({post: post_i});
            if (flip_coin || !comments.length)
            {
                // Here we find if that user did a like in that post
                const liked_the_post_i = await Like.find({ from_user: user._id, post: post_i._id });
                if (liked_the_post_i.length === 0)
                {
                    const liked_post = new Like({type: "like", from_user: user._id, post: post_i._id});
                    await liked_post.save();
                    await Post.updateOne( { _id: post_i._id },
                        {
                            $inc: {'count': 1}
                        })
                }
                else
                {
                    i--;
                }
            }
            else
            {
                var comments_post = new Array();
                
                for(const comment of comments)
                {
                    comments_post = comments_post.concat(await get_comments(comment));
                }
                comments_post = comments_post.concat(comments);

                console.log(comments_post);
                const comment_i = comments_post[Math.floor(Math.random() * comments_post.length)];

                // Here we find if that user did a like in that post
                const liked_the_comment_i = await Like.find({ from_user: user._id, post: post_i._id });

                if (liked_the_comment_i.length === 0)
                {
                    const liked_comment = new Like({type: "like", from_user: user._id, comment: comment_i._id});
                    await liked_comment.save();
                    await Comment.updateOne( { _id: comment_i._id },
                        {
                            $inc: {'count': 1}
                        })
                }
                else
                {
                    i--;
                }
            }   
        }
    }
}

app.post('/api/matrix/createdb', async (req, res) => {
    await rm("./pics"); await rm("./pictures"); await rm("./videos"); await rm("./audios");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Post__Star_Value__User.deleteMany({});
    // insert_users( "user@rr", "rr!!aaAA11", "red", "red", "3463432135", "red.png" );
    // insert_users( "user@bb", "bb!!aaAA11", "blue", "blue", "3463432135", "blue.jpg" );
    // insert_users( "user@yy", "yy!!aaAA11", "yellow", "yellow", "3463432135", "yellow.jpg" );
    // insert_users( "user@pp", "pp!!aaAA11", "purple", "purple", "3463432135", "purple.jpg" );

    const firstNames = JSON.parse(fs.readFileSync('./database/first-names.json'));
    const lastNames = JSON.parse(fs.readFileSync('./database/names.json'));
    

    var users = new Array();  
    // Generate 100 random users
    for (let i = 0; i < 10; i++) 
    {
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const pics = ["blue.jpg", "purple.jpg", "red.png", "yellow.jpg"];
        
        const first_name = randomFirstName;
        const last_name = randomLastName;
        const email = first_name+last_name+"@di.uoa.gr";
        const phone_number = "3643536444346";
        const password = "11!!AAaa";
        const profile_pic = pics[Math.round(Math.random())%4+1];

        const user = await insert_users( email, password , first_name, last_name, phone_number, profile_pic, first_name + " " + last_name);
        users.push(user._id);
        const count = Math.random() * 6 ;
        for (var ii = 0; ii < count; ii++)
        {
            await insert_posts(user);
        }
    }

    await make_random_friends(users);

    await make_comments_from_user(users);

    await comment_to_comment_from_user(users);

    await make_like_post_and_comment(users);

    res.status(200).json({ message: 'Database created successfully'});
  
});

module.exports = app;