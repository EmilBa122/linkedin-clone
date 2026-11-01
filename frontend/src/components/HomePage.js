import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Post from './Post';

import './HomePage.css';
import "./Post.css";

// For the attaching media icon
import { GoFileMedia } from "react-icons/go";


// The Home Page, what a user will see as a Home Page if that user logged in successfully
const Home = () => {

  const { user } = useContext(AuthContext);
  if (!user) return null;

  const [users, setUsers] = useState([]);

  const [posts, setPosts] = useState([]);

  const [postAdded, setPostAdded] = useState(false);

  const [modalShow, setModalShow] = React.useState(false);

  
  const inputFileRef = useRef( null );

  const fetchUsers = async (searchQuery) => {
      try {
        const response = await fetch(`https://localhost:8443/api/search?q=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  const remove = (fileName) => {
    // console.log(new_files);
    // console.log(fileName);
    for (var i = 0; i < new_files.length; i++) 
    {
      if (new_files[i]) 
      {
        if (new_files[i].name == fileName) 
        {
          new_files[i] = null;
        }
      }  
    }
    // console.log(new_files);
  };

  // Everytime the user will make a new post the useEffect will be run to be able the user to see in real time the
  // new post with the other existed posts on the screen without the need to reload the page for to see the new post 
  useEffect(() => {
    // The window.handleClose function is being called immediately when the user in the creation of a post clicks 
    // the close button in a file who had selected before for this post to remove this file from the post
    // before sumbitting this post 
    window.handleClose = (fileName) => {
      const fileElement = document.getElementById(fileName);
      if (fileElement) 
      {
          fileElement.remove(); // Remove the file element from the DOM
          
          remove(fileName);
      }
    };

    const fetchPost = async (searchQuery) => {
      try {
        const response = await fetch('https://localhost:8443/api/posts', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include credentials (cookies)
        });

        if (response.ok) 
        {
          const data = await response.json();
          // setPosts(data.posts);
          if (postAdded) 
            setPostAdded(false);
          const posts_2 = data.posts.map(myFunction);

          function myFunction(value, index, array) {
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
            return value;
          }
          setPosts(posts_2);
        } 
        else 
        {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPost();

  }, [postAdded]);

  const handleInputChange = (e) => {
      if (e.target.value) {
        fetchUsers(e.target.value);
      } else {
        setUsers([]);
      }
  };

  var [new_files, setNew_files] = useState([]);
  // The onFileChange function is responsible for handling the user files for this post
  const onFilechange = ( e ) => {

    Array.from(e.target.files).forEach(file => {

      // Add file to the new_files array
      new_files.push(file);
  
      // Create a new div element for the file
      var ul = document.getElementById("files");
      var li = document.createElement("div");
      li.setAttribute("id", file.name);
      li.classList.add("col-auto", "file-container");
  
      // Use FileReader to read the file and display it
      const reader = new FileReader();
  

      // The below code is for displaying the files the user chose to allowing the user 
      // to see a preview of these files while creating the post 
      // (also we have a close button that calls the handleClose function when clicked to remove these files
      // in the case if the user doesnt want these files in the final post)
      reader.onload = function(e) {
          const url = e.target.result; // This is a data URL
          
          // Check the file type and display accordingly
          if (file.type.startsWith('image')) {
              document.getElementById(file.name).innerHTML = `
                <img src="${url}" alt="Uploaded Image" width="200" />
                <div className="close-button" onclick="handleClose('${file.name}')">
                    &times;
                </div>
              `;
          }
          if (file.type.startsWith('video')) {
              document.getElementById(file.name).innerHTML = `
                <video controls src="${url}" alt="Uploaded Video" width="200">
                    Your browser does not support the video tag.
                </video>
                <div className="close-button" onclick="handleClose('${file.name}')">
                    &times;
                </div>
              `;
          }
          if (file.type.startsWith('audio')) {
              document.getElementById(file.name).innerHTML = `
                <audio controls src="${url}" alt="Uploaded Audio" width="200">
                    Your browser does not support the audio tag.
                </audio>
                <div className="close-button" onclick="handleClose('${file.name}')">
                    &times;
                </div>
              `;
          }
      };
  
      reader.readAsDataURL(file); // Read the file as a data URL
  
      ul.appendChild(li);

      const element=document.getElementById("post_button");
      if (new_files)
      {
        element.disabled = false;
      }
      else
      {
        element.disabled = true;
      }    
      document.getElementById('post_button').addEventListener('click', handleSubmit);
    });
  }

  
  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  }

  function addPost(value) {
    const element=document.getElementById("post_button");
    if (value.length > 0 || files.length > 0 ) 
    {
      element.disabled = false;
    }
    else
    {
      element.disabled = true;
    }  
    document.getElementById('post_button').addEventListener('click', handleSubmit);
  }

  // When the user clicks the Post button the handleSubmit will be executed 
  // The handleSubmit function will gather the information that the user added 
  // to the post and will send it to the server
  async function handleSubmit () {
    const content = document.getElementById("content").value;
    const formData = new FormData();

  
    formData.append('content', content);


    Array.from(new_files).forEach(file => {
      if (file) 
      {
        formData.append('files', file);
      }
    });

    try {
      const response = await fetch('https://localhost:8443/api/post', { 
        method: 'POST',
        credentials: 'include', // Include credentials (cookies)
        body: formData
      });
      const data = await response.json();
      if (response.ok) 
      {
        setModalShow(false);
        // The setPostAdded(true) updates the postAdded state and with that will trigger the useEffect hook
        setPostAdded(true);
        for (var i = 0; i < new_files.length; i++) 
        {
          new_files[i] = null;
        }
      } 
      else 
      {
        console.error(data.error);     
      }
    } catch (error) {
      console.error('Error:', error);
    }
  } 


  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Post
          </Modal.Title>
        </Modal.Header>
        {/* for creating a post */}
        <Modal.Body>
        <form>
            <div className="form-group">
              <textarea 
                className="form-control" id="content" rows="10" 
                placeholder='What do you want to talk about ?'
                onChange={(e) => addPost(e.target.value)}
                >  
              </textarea>
            </div>
        </form>
        <div id="files" className="row">
            
        </div>
        </Modal.Body>

        <Modal.Footer>
        
          <button onClick={onBtnClick}>
            <GoFileMedia className="fs-5" />
          </button> 
          <input id="input"
            type='file'
            multiple // Allows selection of multiple files
            ref={inputFileRef} // Reference to trigger click
            onChange={onFilechange}
            style={{ display: 'none' }} // Hide the file input
          /> 
        
          <button disabled id="post_button">Post</button>
        </Modal.Footer>
      </Modal>
      
    );
  }
  return (
      <div>
          <h1>Welcome, {user.email}</h1>
          <input type="text" name="search" onChange={handleInputChange}/>
          <ul>
              {users.map((user) => (
              <li key={user._id}>{user.first_name} {user.last_name}</li>
              ))}
          </ul>
          
          <>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                Create Post
              </Button>

              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
          </>  

          {/*To create space between the button Create Post and the posts as they are displayed on the website*/}
          <div className="mt-5 col-md-12"></div>

          {console.log(posts)}

          {posts.map((post) => (
            // here you tell which unique key will have for this post with the key={post._id} it needs it to render 
            // the post but you cant access this unique key inside of the component post (i.e. Post.js) this is 
            // why we have the post_key
            <Post key={post._id} post_key={post._id} content={post.content} pictures={post.pictures} videos={post.videos} 
              audios={post.audios} user={post.user} date={post.createAt} count={post.count} mycount={post.mycount}/>))}
      </div>
  );
};

export default Home;