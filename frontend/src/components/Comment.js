import React, { useState, useEffect } from 'react';

// For the like button
import { AiOutlineLike } from "react-icons/ai";

// For the comment icon
import { TfiCommentAlt } from "react-icons/tfi";

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';


const Comment = ({ comm }) => {

  const [comment, setComment] = useState(false);

  const [listener, setListener] = useState(false);

  const [comments, setComments] = useState([]);

  const [commentadded, setCommentadded] = useState(false);
  
  const [isLiked, setisLiked] = useState(comm.mycount == 0);

  const [likes, setLikes] = useState(comm.count);

  const link = `/personal?id=${comm.user._id}&name=${comm.user.name}`;

  // Everytime the user will make a new comment the useEffect will be run to be able the user to see in real time 
  // the new comment with the other existed comments on the screen without the need to reload the page for to see 
  // the new comment 
  useEffect(() => {
    const fetchComment_to_Comment = async () => {
      try {
        const body = JSON.stringify({ comment_key: comm._id });
        console.log(body);
        const response = await fetch('https://localhost:8443/api/comments_to_comments', { 
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

    fetchComment_to_Comment();
    
  }, [commentadded]);

  function addComment_to_Comment(target) {
    // alert(target.id);
    const value = target.value;
    const element=document.getElementById(comm._id+"_button");
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
  async function handleSubmit () 
  {
    const content = document.getElementById(comm._id).value;
    const body = JSON.stringify({content, comment_key: comm._id});
    console.log(body);
    try {
      const response = await fetch('https://localhost:8443/api/comment_to_comment', { 
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
        // the below is for when you do a comment to clean it from the comment section
        document.getElementById(comm._id).value="";
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
    const button = document.getElementById("like_"+comm._id);
    const body = JSON.stringify({content: "like", comment: comm._id});
    console.log(body);
    // if the user didnt liked the comment before the click event 
    if (button.classList.contains("btn-secondary"))
    {
      try {
        var response;
        // if its not a "nested" comment
        if (comm.comment === null)
        {
          response = await fetch('https://localhost:8443/api/comment/like', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies)
          body: body
          });
        }
        // if its a "nested" comment
        else
        {
          response = await fetch('https://localhost:8443/api/comment_to_comment/like', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies)
          body: body
          });
        }
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
        var response
         // if its not a "nested" comment
        if (comm.comment === null)
        {
          response = await fetch('https://localhost:8443/api/comment_to_comment/dislike', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials (cookies)
            body: body
          });
        }
        // if its a "nested" comment
        else
        {
          response = await fetch('https://localhost:8443/api/comment/dislike', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials (cookies)
            body: body
          });
        }
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
    <div key={comm._id}>
      <p>
        <Link className="text-decoration-none" to={link}>
          <img 
              src={`https://localhost:8443/pics/${comm.user.profile_pic}`}
              alt="Profile"
              className="rounded-circle"
              width="50" // Adjust size as needed
              height="50" // Adjust size as needed
          />
        </Link>

        &nbsp;

        <Link to={link} className="link-dark text-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"> 
                  {`${comm.user.first_name}`} {`${comm.user.last_name}`}
        </Link>
      
        <br />
        <span className="mb-2 small">
            {comm.createAt}
        </span>
      </p>
      <p>
        &emsp;{comm.content}
      </p>
      {likes}
      &nbsp;

      {/* With the id={`like_${comm._id}`} we create a unique id for this like button as like_ + comm._id 
          to know on which button we refer to*/}
      <Button id={`like_${comm._id}`} variant={isLiked ? "secondary" : "primary"} onClick={() => addLike("like")}>
        <AiOutlineLike className="fs-5"/>
      </Button>


      &nbsp;
      &nbsp;
    
      <Button variant="primary" onClick={() => setComment(clicked => !clicked)}>
        <TfiCommentAlt className="fs-5"/>
      </Button>

       <div id="create_comment"> {/*style={{display: comment ? 'block' : 'none' }}>  */}
          <div style={{display: comment ? 'block' : 'none' }}>
              <form>
                <div className="form-group">
                  <textarea 
                    className="form-control" id={`${comm._id}`} rows="10" 
                    defaultValue={`${comm.user.first_name} ${comm.user.last_name} `} 
                    onChange={(e) => addComment_to_Comment(e.target)}
                  >      
                  </textarea>
                </div>
              </form>
            
              {/* With the id={`${comm._id}_button`} we create the unique id for this Reply button as 
                  comm._id + _button to know on which button we refer to*/}
              <button disabled id={`${comm._id}_button`}>Reply</button>
          </div>

          {comments.map((comment) => (
            // now if the user did a "nested" comment in this post the comments state has it so we call 
            // recursively the component Comment 
            // and we tell which unique key will have for this comment with the key={comment._id} 
            // it needs it to render the comment
            <Comment key={comment._id} comm={comment}/>
          ))}        
      </div>
    </div>
  );
};

export default Comment;