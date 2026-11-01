import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// For the like button
import { AiOutlineLike } from "react-icons/ai";

// For the comment icon
import { TfiCommentAlt } from "react-icons/tfi";

import Comment from './Comment';

const Post = ({ post_key, content, pictures, videos, audios, user, date, count, mycount }) => {

  const [comment, setComment] = useState(false);

  const [listener, setListener] = useState(false);

  const [comments, setComments] = useState([]);

  const [commentadded, setCommentadded] = useState(false);

  const [isLiked, setisLiked] = useState(mycount == 0);

  const [likes, setLikes] = useState(count);

  const link = `/personal?id=${user._id}&name=${user.name}`;
  
  // Everytime the user will make a new comment the useEffect will be run to be able the user to see in real time 
  // the new comment with the other existed comments on the screen without the need to reload the page for to see 
  // the new comment 
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const body = JSON.stringify({ post_key });
        console.log(body);
        const response = await fetch('https://localhost:8443/api/comments', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies)
          body: body,
        });

        if (response.ok) 
        {
          const data = await response.json();
          const comment_2 = data.comments.map(myFunction);

          function myFunction(comment, index, array) {
            var value = comment;
            var date = new Date(value.createAt);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are zero-indexed
            const year = date.getFullYear();

            // Format the string
            const formattedDate = `${hours}:${minutes} ${dayOfWeek} ${day}/${month}/${year}`
            value.createAt = formattedDate;
            // console.log(value.user);
            return comment;
          }
          setComments(comment_2);

          if (commentadded) 
            setCommentadded(false);

        } 
        else 
        {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchComment();
    
  }, [commentadded]);

  function addComment(target) {
    // alert(target.id);
    const value = target.value;
    const element=document.getElementById(post_key+"_button");
    // alert(target.id+"_button");
    if (value.length > 0) 
    {
      element.disabled = false;
    }
    else
    {
      element.disabled = true;
    }    
    if (!listener)
    {
      setListener(true);
      element.addEventListener('click', handleSubmit);
    }
  }

  // When the user clicks the Reply button the handleSubmit will be executed 
  // The handleSubmit function will gather the information that the user added 
  // to the comment and will send it to the server
  async function handleSubmit () {
    console.log("ama mam");
    const content = document.getElementById(post_key).value;
    const body = JSON.stringify({content, post_key});
    console.log(body);
    try {
      const response = await fetch('https://localhost:8443/api/comment', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials (cookies)
        body: body
      });
      const data = await response.json();
      if (response.ok) 
      {
        setComment(false);
        // The setCommentadded(true) updates the commentadded state and with that will trigger the useEffect hook
        setCommentadded(true);
        // the below is for when you do a comment to clean it from the post
        document.getElementById(post_key).value="";
      } 
      else 
      {
        console.error(data.error);     
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } 

  async function addLike () 
  {
    const button = document.getElementById("like_"+post_key);
    const body = JSON.stringify({content: "like", post: post_key});
    console.log(body);
    // if the user didnt liked the post before the click event 
    if (button.classList.contains("btn-secondary"))
    {
      try {
        const response = await fetch('https://localhost:8443/api/post/like', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies)
          body: body
        });
        const data = await response.json();
        if (response.ok) 
        {
            button.classList.remove("btn-secondary");
            button.classList.add("btn-primary");
            setLikes(likes+1);
        } 
        else 
        {
          console.error(data.error);     
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    // if the user did liked the post before the click event
    else
    {
      try {
        const response = await fetch('https://localhost:8443/api/post/dislike', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies)
          body: body
        });
        const data = await response.json();
        if (response.ok) 
        {
            button.classList.remove("btn-primary");
            button.classList.add("btn-secondary");
            setLikes(likes-1);
        } 
        else 
        {
          console.error(data.error);     
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  } 

  return (
      <div className="d-flex justify-content-center mt-2 col-md-12">
          <Card border="primary" className="d-flex card text-start" style={{ width: '60%' }}>
            <Card.Body>
              <Card.Title>
                <Link to={link}>
                    {console.log("fdsfssdfsdg  "+user.profile_pic)}
                    <img 
                        src={`https://localhost:8443/pics/${user.profile_pic}`}
                        alt="Profile"
                        className="rounded-circle"
                        width="50" // Adjust size as needed
                        height="50" // Adjust size as needed
                    />
                </Link>

                &nbsp;
                <Link to={link} className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                        {`${user.first_name}`} {`${user.last_name}`}
                </Link>
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted small">
                {date}
              </Card.Subtitle>
              <div className="mt-3 col-md-12"></div>
              <Card.Text>
                <span style={{ display: 'block'}}>
                  {(content && content.length > 0) ?
                        content
                        : null}
                </span>

                {/* <span style={{ display: 'block'}} className="mt-5 col-md-12"></span>  */}
                
                <span style={{ display: 'block'}}>
                  {videos && videos.length > 0 ? 
                      videos.map((video, index) => (
                        <video key={index} className="mt-4 col-md-12" width="600" controls>
                          <source src={`https://localhost:8443/videos/${video}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video> 
                      ))
                      : null}
                </span>   

                {/* <span style={{ display: 'block'}} className="mt-5 col-md-12"></span>  */}
                
                <span style={{ display: 'block'}}>
                  {pictures && pictures.length > 0 ?
                      
                      pictures.map((picture, index) => (
                        <img key={index} className="mt-4 col-md-12" width="600" src={`https://localhost:8443/pictures/${picture}`} alt="Post Image" />
                      ))
                      : null}
                </span>   

                {/* <span style={{ display: 'block'}} className="mt-5 col-md-12"></span>  */}

                <span style={{ display: 'block'}}>
                  {audios && audios.length > 0 ?
                      audios.map((audio, index) => (
                        <audio key={index} className="mt-4 col-md-12" controls>
                          <source src={`https://localhost:8443/audios/${audio}`} type="audio/mp3" />
                        </audio>
                      ))                  
                      : null}
                </span>   

              </Card.Text>


              {likes}
              &nbsp;
              {/* With the id={`like_${post_key}`} we create a unique id for this like button as like_ + post_key 
                  to know on which button we refer to*/}
              <Button id={`like_${post_key}`} variant={isLiked ? "secondary" : "primary"} onClick={() => addLike("like")}>
                <AiOutlineLike className="fs-5"/>
              </Button>

              &nbsp;
              &nbsp;
          
              <Button variant="primary" onClick={() => setComment(clicked => !clicked)}>
                <TfiCommentAlt className="fs-5"/>
              </Button>

              {/* the below line is to hide or show the comments from a post */}
               <div id="create_comment" style={{display: comment ? 'block' : 'none' }}>
              
                  {/* <div style={{display: comment ? 'block' : 'none' }}> */}

                    <form>
                      <div className="form-group">
                        <textarea 
                          className="form-control" id={`${post_key}`} rows="10" 
                          defaultValue={`${user.first_name} ${user.last_name} `} 
                          onChange={(e) => addComment(e.target)}
                          >  
                        </textarea>
                      </div>
                    </form>
                    
                  

                    {/* With the id={`${post_key}_button`} we create the unique id for this Reply button as 
                    post_key + _button to know on which button we refer to*/}
                    <button disabled id={`${post_key}_button`}>Reply</button>
                      {console.log(comments)}
                  
                  {/* </div> */}
                  
                  {comments.map((comment) => (
                    // here you tell which unique key will have for this comment with the key={comment._id} 
                    // it needs it to render the comment
                    <Comment key={comment._id} comm={comment}/>
                  ))}
              </div> 

            </Card.Body>
          </Card>        
        </div>
  );
};

export default Post;