const express = require('express');
const User = require('../models/User'); // Import the User model
const Post = require('../models/Post');
const Like = require('../models/Like');
const Connections = require('../models/Connections');
const Comment = require('../models/Comment');
const Post__Star_Value__User = require('../models/MatrixFactorization');
const app = express.Router();

// Link for the below code
// https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
}

async function matrix_factorization()
{
    const users = await User.find({});
    const posts = await Post.find({});

    var matrix_X = new Array(users.length);
    var i = 0;

    for (const user of users) 
    {
        console.log(user);
        const friendships = await Connections.find({
            $or: [
                { from: user._id },
                { to: user._id }
            ],
            connect: 1
        });

        
        const friends = friendships.map(friendship => {
            
            if (friendship.from.toString() === user._id.toString()) 
            {
                return friendship.to;
            } 
            else 
            {
                return friendship.from;
            }
        });

        const unique_friends = Array.from(new Map(friends.map(id => [id.toString(), id])).values());



        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");
        console.log(friends);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");
        console.log(unique_friends);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");
        
    
        // We find all the posts of the friends of that user if they did
        const friend_posts = await Post.find({ user: { $in: unique_friends } });

        var row_x = new Array(posts.length);
        matrix_X[i] = row_x;
        var j = 0;
        
        for (const post of posts) 
        {
            var star_value = 0;

            const like = await Like.find({from_user: user._id, post: post._id});
            if (like.length)
            {
                // 1) If the user have liked this post
                star_value = star_value + 2;
            }


            var friend_post = [];
            for (const temp_friend_post of friend_posts)
            {
                if (temp_friend_post._id.equals(post._id))
                {
                    friend_post.push(temp_friend_post);
                    break; 
                }
            }

            if (friend_post.length)
            {
                // 2) If its a friend post
                star_value++;
            }
            
            // We find all the comments for this post but not the nested comments
            const post_comments = await Comment.find({post: post._id});

            let post_user_infos_obj = { flag_commented: false, // this flag is if the user did a comment or a nested comment
                                        liked_comment: false, // this flag is if the user liked a comment or a nested comment
                                    }
               
            // The below function is being used for the nested comments for this post to find if the user did
            // a nested comment and liked a nested comment in the case of if that user didnt like a comment or 
            // didnt make a comment before the nested comments 
            async function Commented_On_Comment(comment, post_user_infos_obj) 
            {
                const comments_to_comment = await Comment.find({ comment: comment._id });
            
                for (const comment_to_comment of comments_to_comment) 
                {
                    // To not search for liked nested comments if we find already one for that user 
                    // or if that user liked the post 
                    if (!(post_user_infos_obj.liked_comment || like.length))
                    {
                        const liked_comment = await Like.find(({from_user: user._id, comment: comment_to_comment._id}))
                        
                        if (liked_comment.length)
                        {
                            post_user_infos_obj.liked_comment = true;
                        }

                        
                        if (post_user_infos_obj.flag_commented && (post_user_infos_obj.liked_comment || like.length))
                        {
                            return;
                        }
                    }

                    if (!post_user_infos_obj.flag_commented)
                    {
                        if (comment_to_comment.user._id.equals(user._id)) 
                        {
                            // We find a nested comment that this user made
                            post_user_infos_obj.flag_commented = true;
                            // If this user liked the post we dont want to search if that user liked a nested comment 
                            if (like.length)
                                return;
                            if (post_user_infos_obj.liked_comment)
                                // We find the nested comment the user did and the liked nested comment the user liked
                                // so we return 
                                return;
                        }
                    }    
            
                    if (post_user_infos_obj.flag_commented && (post_user_infos_obj.liked_comment || like.length))
                    {
                        return;
                    }

                    await Commented_On_Comment(comment_to_comment, post_user_infos_obj);
                    
                    if (post_user_infos_obj.flag_commented && (post_user_infos_obj.liked_comment || like.length))
                    {
                        return;
                    }
                }
                return;
            }

            // For every comment of this post despite the nested comments
            for (const comment of post_comments) 
            {
               
                if (comment.user._id.equals(user._id)) 
                {
                    // The user has commented to this post
                    post_user_infos_obj.flag_commented = true;
                    // Beginning for the 4) If the user have liked (either the post or a comment to this post)
                    // and commented (either on the post or comment_to_comment)       
                }

                if (!like.length)
                {
                    const liked_comment = await Like.find({from_user: user._id, comment: comment._id});
                    if (liked_comment.length)
                    {
                        // The user have liked a comment on this post
                        post_user_infos_obj.liked_comment = true;
                    }
                }

                if (!like.length)
                    await Commented_On_Comment(comment, post_user_infos_obj);

                if (post_user_infos_obj.flag_commented) 
                {
                    // The user sure made a comment to this post
                    // 3) If the user has commented to this post
                    star_value++;
                    if (like.length)
                    {
                        // The user have liked the post and made a comment_to_comment in it 
                        star_value = star_value + 2;
                        break;
                    }
                    else if (post_user_infos_obj.liked_comment)
                    {
                        // The user have liked a comment inside of this post and made a commnet_to_comment to this post
                        star_value = star_value + 2;
                        break;
                    }
                    
                }
            }


            // 5) If this post was created from that user
            if (post.user._id.equals(user._id))
            {
                star_value = star_value + 2;   
            }

            // 6) If that user liked (either the post or a comment) for this post (which this post wasnt created 
            // by the user) but created by a friend of that user 
            // 7) If that user made a comment (either a comment for this post or a nested comment) to this post 
            // (which this post wasnt created by the user) but created by a friend of that user
            if (friend_post.length)
            {        
                // From the above with the help of the object post_user_infos_obj                   
                // we found if for this post this user liked a comment or a nested comment 
                // and if that user did a comment or a nested comment for this post 

                if (post_user_infos_obj.liked_comment || like.length)
                {
                    star_value++;
                }

                if (post_user_infos_obj.flag_commented)
                {
                    star_value++;
                }
            }

            // 8) If this post has many likes
            const likes = await Like.find({post: post._id});
            if (likes.length > (users.length / 2))
            {
                star_value++;
            }

            // 9) If this post is from a friend of friend for that user
            var friends_of_friends = [];
            for (const friend of unique_friends)
            {
                const temp_friendships = await Connections.find({
                    $or: [
                        { from: friend._id },
                        { to: friend._id }
                    ],
                    connect: 1
                });

                friends_of_friends.push(temp_friendships.map(friendship => {
                
                    if (friendship.from.toString() === user._id.toString()) 
                    {
                        return friendship.to;
                    } 
                    else 
                    {
                        return friendship.from;
                    }
                }));

            }

            friends_of_friends = friends_of_friends.flat();

            friends_of_friends = [...new Set(friends_of_friends)];

            friends_of_friends = friends_of_friends.filter(friends_of_friend => friends_of_friend._id.toString() !== user._id.toString());

            friends_to_friends = Array.from(new Map(friends_of_friends.map(id => [id.toString(), id])).values());
                   
            const friend_of_friend_posts = await Post.find({ user: { $in: friends_of_friends } });

            var flag_friend_of_friend_post = false;
            for (const friend_post_temp of friend_of_friend_posts)
            {
                if (friend_post_temp._id.equals(post._id))
                {
                    flag_friend_of_friend_post = true
                    break; 
                }
            }

            if (flag_friend_of_friend_post.length)
            {
                star_value++;
            }

            matrix_X[i][j] = star_value;
            j++;
        }
        i++;   
    }

    for (var i = 0; i < users.length; i++)
    {
        console.log(matrix_X[i]);
    }


    const M = matrix_X.length;
    const N = matrix_X[0].length;
    const K = 2;

    var V = new Array(M);
    for (var i = 0; i < M; i++)
    {
        const max_value = 3;
        V[i] = new Array(K);
        for (var j = 0; j < K; j++)
        {
            V[i][j] = Math.floor(Math.random() * max_value);
        }
    }

    var F = new Array(K);
    for (var i = 0; i < K; i++)
    {
        const max_value = 3;
        F[i] = new Array(N);
        for (var j = 0; j < N; j++)
        {
            F[i][j] = Math.floor(Math.random() * max_value);
        }
    }

    const learning_rate = 0.01;
    var count = 0;
    var SE = 0;
    for (var ii = 0; count < 2; ii++)
    {
        var SE_old = SE;
        SE = 0;
        
        for (var i = 0; i < M; i++)
        {
            for (var j = 0; j < N; j++)
            {
                if (matrix_X[i][j] !== 0)
                {
                    var x_hat = 0;
                    for (var k = 0; k < K; k++)
                    {
                        x_hat = x_hat + V[i][k] * F[k][j];
                    }

                    var eij = matrix_X[i][j] - x_hat;
                    for (var k = 0; k < K; k++)
                    {
                        var old_Vik = V[i][k];
                        V[i][k] = V[i][k] + learning_rate * 2* eij * F[k][j];
                        F[k][j] = F[k][j] + learning_rate * 2 * eij * old_Vik;
                    }
                    SE = SE + eij * eij;
                }
            }
        }

        if (SE >= SE_old && ii)
        {
            count++;
        }
        else
        {
            count = 0;
        }
    }

    var X_predictide = multiply(V, F);

    for (var i = 0; i < users.length; i++)
    {
        console.log(X_predictide[i]);
    }
    await Post__Star_Value__User.deleteMany({});
    for (var i = 0; i < M; i++)
    {
        for (var j = 0; j < N; j++)
        {
            var X = new Post__Star_Value__User({for_user: users[i]._id, for_post: posts[j]._id, star_value: X_predictide[i][j]});
            await X.save();
        }
    }            
}

app.post('/api/matrix_factorization', async (req, res) => {

    await matrix_factorization();


    res.status(200).json({ message: 'Everything worked fine'});
});

module.exports = 
{
    app,
    matrix_factorization
};
