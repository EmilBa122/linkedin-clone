<h1 align="center">Professional Networking Application<br>(LinkedIn-style)</h1>

<h3 align="center"><i>Developed by:</i></h3>
<h3 align="center"><a href="https://www.linkedin.com/in/emil-bantak-2219b3292/">Bantak Emil</a></h3>
<h3 align="center"><a href="https://www.linkedin.com/in/apostolos-bonotis-8a54a3243/">Bonotis Apostolos Nikolaos</a></h3>

# Assignment Description

Creation of a professional networking web application (LinkedIn-style). The application has two types of users, the administrator and the professional. The professionals can register and log in, build their network by sending and accepting connection requests, post articles with text, photos, videos and audio files, comment on articles and reply to other comments, like articles and comments, exchange private messages with other professionals and visit their personal pages. The administrator can view all the users of the application and export their data in JSON or XML format

The frontend of the application has been implemented with React and the backend with node.js and express.js, while mongodb has been used as the database. The communication between the frontend and the backend is encrypted over HTTPS (SSL/TLS) and the users are authenticated with the Passport library, with bcrypt-hashed passwords and sessions stored in mongodb

Questions 1, 2, 3, 4, 5, 6, 8 and the bonus question 12 have been fully implemented and for question 12 an artificial dataset has been constructed. Question 10 has been partially implemented i.e. the personal information page of a user is displayed, which shows private data only to connected users

# Table of Contents

- [Work Distribution](#work-distribution)
- [Procedures and Execution of the Project](#procedures-and-execution-of-the-project)
  - [Installing the dependencies (node_modules)](#installing-the-dependencies-node_modules)
  - [Generating the certificate](#generating-the-certificate)
  - [Running the project](#running-the-project)
  - [Using the ready-made database](#using-the-ready-made-database)
  - [Browser, Project and Certificate](#browser-project-and-certificate)
- [Schemas and models part explanation of design choices](#schemas-and-models-part-explanation-of-design-choices)
- [Use of “global” states and setter in the components of App.js](#use-of-global-states-and-setter-in-the-components-of-appjs)
- [Use of Passport library for register and login (QUESTIONS 1 AND 2)](#use-of-passport-library-for-register-and-login-questions-1-and-2)
- [Admin Features](#admin-features)
- [QUESTION 5](#question-5)
  - [Files Header.js and LeftSideBar.js (frontend part)](#files-headerjs-and-leftsidebarjs-frontend-part)
  - [File HomePage.js (frontend part)](#file-homepagejs-frontend-part)
  - [File Post.js (frontend part)](#file-postjs-frontend-part)
  - [File Comment.js (frontend part)](#file-commentjs-frontend-part)
  - [File comment.js (backend part)](#file-commentjs-backend-part)
  - [File post.js (backend part)](#file-postjs-backend-part)
- [Message exchange system](#message-exchange-system)
- [Network](#network)
- [CHAPTER 12](#chapter-12)
  - [Matrix Factorization](#matrix-factorization)
  - [Creation of random artificial data](#creation-of-random-artificial-data)
- [Conclusion](#conclusion)

# Work Distribution

**Implemented by: Bantak Emil**

- **Questions 1 and 2:** welcome page with login and a multi-step registration form (email/password with strength check, name, phone and 
profile photo, reCAPTCHA). Login and registration use the Passport library with bcrypt-hashed passwords and sessions stored in mongodb. 
Pages that need a login are protected and redirect to the welcome page. The backend runs over HTTPS and HTTP requests are redirected to HTTPS
- **Question 5:** the top bar with the tabs (the active tab is highlighted) and the left sidebar with the user's photo, name and links to their 
personal page and network. The home page shows a timeline with posts. Users can create posts through a pop-up window where they can write text 
and attach any number of photos, videos and audio files, preview them and remove any before posting. Uploaded files are stored on the backend 
in separate folders by type. Each post shows its author, date, number of likes and its comments. Users can like posts and comments and reply not 
only to posts but also to other comments, without any limit. Comments are hidden until the user opens them. When a user creates a 
post or comment, it appears immediately without reloading the page and when a user likes or unlikes a post or comment, the like counter updates 
immediately as well. Posts, comments and likes made by other users appear after the page is refreshed
- **Question 12:** the Matrix Factorization recommendation algorithm, implemented from scratch without ready-made libraries. 
The user-post matrix is initialized using 9 criteria (likes, comments, friends posts, friends of friends, popular posts,  more details in the 
[Matrix Factorization chapter](#matrix-factorization)) and is then factorized with gradient descent, which stops when the error stops decreasing. 
The predicted scores are saved in the database and decide the order in which posts are shown on the home page, with the user's own and 
friends posts come first, followed by the rest by predicted score. The algorithm is recalculated automatically every hour. 
Also the generator of the artificial dataset, which creates 10 users with random names and photos, posts with random media, friendships, 
comments, nested comments and likes
- **General:** the backend server setup (express.js with HTTPS, sessions, CORS, serving of uploaded media files and the hourly scheduled job for 
Matrix Factorization), the database schemas and models (User, Post, Comment, Like, MatrixFactorization) and the global user state (AuthContext),
which shares the logged-in user across all frontend pages without passing it from component to component. 


**Implemented by: Bonotis Apostolos Nikolaos**

- **Questions 3 and 4:** the admin page, which only the admin can access. It shows all users in a table and the admin can select one or 
more users and export their posts, comments (including nested ones) and connections in JSON or XML format
- **Question 6:** the network page with user search. Users can send connection requests, accept or decline incoming requests, cancel sent 
requests and disconnect and they can visit other users personal pages
- **Question 8:** the private messaging system, with a list of conversations showing the messages exchanged and a chat window that updates
continuously with the new messages
- **Question 10 (partial):** the personal information page, which shows private data only to connected users

# Procedures and Execution of the Project

The project was implemented in an Ubuntu environment (version 22.04 LTS)

In the implementation of the project the following were used

node.js (version 20.17.0)\
npm (version 10.8.2)\
mongodb (version 7.0.12)

The mongodb was used as the database for the project

The project has been split into two parts in the frontend and in the backend directory where each one executes the part of the frontend and of the backend respectively. In the implementation of the frontend of the project React was used. And for the backend node.js and express.js were used

## Installing the dependencies (node_modules)

The node_modules folders are not included in the repository, so before the first execution of the project you must install them. 
Open two terminal windows, one inside the backend directory and the other inside the frontend directory, and write the commands below:

In the terminal of the backend directory:

```bash
npm i
```

In the terminal of the frontend directory:

```bash
npm i --legacy-peer-deps
```

This has to be done only once.<br>

So now you have downloaded all the necessary node_modules to run this project

## Generating the certificate

The project runs over HTTPS, so it needs a certificate. For security reasons the certificate files that I used were not uploaded to this 
repository, so before the first execution of the project you must generate them yourself. The files that are needed are the following:

- backend/private.key
- backend/certificate.crt
- frontend/private.key
- frontend/certificate.crt

Open a terminal window inside the backend directory and write the command below, which creates the files private.key and certificate.crt inside
the backend directory:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout private.key -out certificate.crt -days 365 -subj "/CN=localhost"
```

Then, in the same terminal, write the command below, which copies these two files into the frontend directory, because the frontend needs 
them too:

```bash
cp private.key certificate.crt ../frontend/
```

This has to be done only once.<br>

So now you have created all the necessary certificate files to run this project.

## Running the project

To execute the project we open for both directories two separate terminal windows and we write in the terminals the commands below:

In the terminal of the backend directory:

1) sudo systemctl start mongod\
   (so that you can interact with your own mongodb database)
2) sudo npm start

In the terminal of the frontend directory:

1) sudo npm start

## Using the ready-made database

Inside the main folder of this project there is the folder produced\_data which contains a ready-made pre-generated database (a database of 10 users and one admin). To import the database you go into the folder produced\_data and then into the folder mydatabase you open a terminal window there and you write the command below:\
mongorestore -d mydatabase .

## Browser, Project and Certificate

The first time you open a browser to see the project you will need to accept the certificate for <https://localhost> and then write in the browser this link <https://localhost:8443> and here too you will need to accept the certificate so that you can see the project (8443 is the port the backend listens on).

# Schemas and models part explanation of design choices

In the backend in the folder models there are all the schemas and models that were used in this project. Of these the only ones that need a further explanation are the following:

1) Comment.js

A comment can be made either on a post or on a comment for this the fields post and comment are used to store in them the unique object id of the post or of the comment on which this comment is made.

The field count contains the number of likes that were made on this comment.

And the field mycount indicates whether the user who created this comment liked their own comment.

2) Like.js

I follow the same logic as in the Comment.js file i.e. I have the fields post and comment so that I know which post or comment the like was made on

3) MatrixFactorization.js

This file is used for Question 12. And it represents a cell that is identified by the id of a user and the id of a post (both of which ids are unique for each user and for each post respectively) and this cell contains for this post the score (star\_value) it has gathered for this user. This cell belongs to a matrix of size M \* N , where M is the number of users and N the number of posts.

4) Post.js

For this schema and model the fields that need an explanation are:

The field count contains the number of likes this post has gathered.

The field mycount is used to indicate whether the user who created this post liked their own post.

In a post a user can post a text and a number of photos, videos and audios and any other combination they want of the above. These photos, videos and audios are stored in the backend in the folders pictures, videos, audios respectively each file that will be stored in these folders will be stored with the name id\_counter.extension where id is the unique id of the post it belongs to, the counter is a number that indicates the number of the file it has in this post and the extension contains the extension of the file respectively. So in the fields pictures, audios and videos are arrays that contain the corresponding names of the files that belong to this post.

5) User.js

In this schema and model the field that needs a further explanation is the profile\_pic.\
The profile pics of the users are stored in the backend in the folder pics with the following naming\
idextension where the id is the unique id of the user and extension is the extension of the picture so in the field profile\_pic this string is stored.

# Use of “global” states and setter in the components of App.js

An efficient way to have the user and not need to pass this user as a prop to every component (see file App.js) in the file AuthContext (it is inside the folder /frontend/src/context ) I declare some “global” states and setter, these “global” states and setter consist of the user state and the setter setUser so when a user registers correctly I update the user state with this user (see file FormPage.js line 104 setUser(data.user)) correspondingly when a user logs in correctly I update the user state with this user (see file IndexPage.js line 29 setUser(data.user)). To see how I “combine” the files AuthContext.js and App.js go to the frontend to the file index.js

# Use of Passport library for register and login (QUESTIONS 1 AND 2)

When a user registers we will finally be directed to the backend part at the endpoint /*api/*register in the file register.js which is located inside the directory routes which apart from doing all the expected operations when a user registers in order to be able using the passport library for this user to become logged in we must first handle the user authentication which is achieved through the passport library with the passport.authenticate(…) function and then using the ready-made logIn method from the passport library I manage to make this user logged in.

Now inside the file login.js which is located inside the directory routes we have the following final endpoints that we will be directed to when:

a) For the user who wants to log in we have the endpoint /*api/login where as previously we use the passport library to achieve this but there is inside comments in this file an old version for the log in user without using the passport library which works correctly.*

*b) To get the current logged in user we use the endpoint /api/user*

*c) And to logout the current logged in user we use the endpoint /api/logout*

*In the frontend part the files that are responsible for questions 1 and 2 are the FormPage.js (for the register part) and the IndexPage.js (for the home page / login part) these files are located inside the folder frontend/src/components*

# Admin Features

Backend:

admin.js:

app.get('/api/admin'):It takes the id of the admin and searches in the database all the users with id different from the admin so that they are displayed in the data table of the adminPage.js.

app.get('/api/admin/getComment'):It finds all the comments,posts and friends for the id it reads from the query of the request,for the friends a filtering is done and we keep only the id of the friend.

app.patch('/api/admin/update'):To find the nested comments without needing recursion it puts in every nested comment the id of the post it belongs to.

app.get('/api/admin/findCommentOnPost'):It finds which post each comment belongs to it is called recursively in the case where the comment is nested.

app.get('/api/admin/getNested'):It finds the nested comment after we have called from the front end the app.patch('/api/admin/update').

Frontend:

AdminPage.js:

In the case where some user who is not an admin tries to enter the admin page they cannot as a check is done whether they are an admin,if they are not then it returns to the previous page.

If the admin tries to enter some other page e.g. /home then through the protected routes they are not allowed and they remain on the admin page.

We have a useeffect that calls the fetchUsers app.get('/api/admin') when we set the admin user. In the fetchUsers we set in the data the id for the entries of the data table and we call the setData to set the data of the data table.

In the columns we define the visible data of the table.\
The findcommentOnPost is recursive and searches until it finds on which post the comment was made and returns the id of the post and updates in the schema of the comment which post this nested comment belongs to.

The getComment fetches the /api/admin/getComment puts in the posts all the comments that are not nested and calls the findcommentOnPost to find the nested comments,it also returns the posts of the user and the friends. Then,when the promise becomes fulfilled it puts in the posts the nested comments and returns the posts that include all the comments,the posts\_data which are the posts of the user and the friends.

The exportData for all the selected rows of the table takes the user id and calls the getComment whose results go into a list result.For each object of the result(comments,posts,friends) we call result.then because it is a promise we add to the data the comments,posts,friends,we keep the selected data and download in json format.The exportXml does the same but it downloads in xml.

For the table we use react-bootstrap.

# QUESTION 5

## Files Header.js and LeftSideBar.js (frontend part)

In the file Header.js the bar of the home page is implemented when a user successfully enters the application. This bar is in the form of active or inactive tabs. It redirects the user to the correct path they want to go to as soon as they press a specific icon.

In the file LeftSideBar.js the left frame of the page is implemented with all the expected functionalities according to the exercise.

These two files are located inside the folder /*frontend*/src/components

## File HomePage.js (frontend part)

In the file HomePage.js the central part of the page is implemented when a user enters the application successfully and various articles are displayed on which they can add comments or mark their interest. As well as it includes a box for entering text or also multimedia (photos, videos, and audio files) where they can post a new article with any combination of the above.

Specifically at first when the user wants to insert a new article, in the initial box that appears to them the button Post is disabled so that they cannot post an empty article. When and if the user writes something in this box the handler onChange is called and the function addPost is executed. Where the addPost in the case where the user wrote something the Post button becomes enabled and then I add an event listener on the Post button for when the user clicks on it. When the user presses the button the handleSubmit function will be executed. The handleSubmit function will gather the data the user added to the post and will send them to the server side.

I follow similar logic when the user inserts multimedia into this post. Specifically if the user adds a file to this post then the handler onChange is called and the function onFilechange is executed. Where this function is responsible to handle the user files. Furthermore inside this function at its end I enable the Post button and then I add an event listener on the Post button for when the user clicks on it. When the user presses the button the handleSubmit function will be executed. Now the handleSubmit function will gather all the data the user added to the post and will send them to the server side.

An important step that the handleSubmit function does inside it is the setPostAdded(true); which updates the postAdded state. With this the useEffect hook is triggered which has as a dependency the postAdded. We do this because we want every time the user makes a new post this post to be displayed in real time on the screen of the user with the already existing posts without the user needing to reload the page every time for these changes to appear. So every time the postAdded changes the useEffect will run displaying the new post on the screen of the user in real time without needing to reload the page for these changes to appear.

Having now the posts at the given moment, we call the component Post (see file Post.js frontend) for each post we have, passing as values the fields of the model post which compose a specific post.

The files HomePage.js and Post.js are located inside the folder /*frontend*/src/components

## File Post.js (frontend part)

Now the file Post.js is responsible for a post (according to the values of the fields that compose this specific post) for displaying the contents of the post (if it has text or also multimedia) for displaying the number of likes it may have, for displaying the comments it may have.

I.e. it is responsible for whatever is related to this post.

Initially we display the content of the post (whether it has text or multimedia or some combination of both).

Next we create an event handler the onClick for click events and when the like button is pressed by the user the function addLike will be executed and given the current state of the liked button i.e. whether it is clicked or not we will set the color of the button as blue or grey. Also for this button we create a unique id as like\_ + post\_key so that we know which button we are referring to. So when the user presses like on the post the function addLike is executed. Which based on the current state of the button (i.e. liked or not) after it sends the new changes to the server side (i.e. whether the user has now liked or disliked the specific post) changes the color of the button based on the new change.

Now as regards the comments for a post we have the following:

Initially we hide them i.e. by default they are not displayed to the user on the main screen to see the comments on a post they will need to press the comment icon on this post.

As with the like button so here too on the comment button we create a unique id as post\_key + \_button so that we know which button we are referring to and we set a handler the onChange where if the user writes something as a comment the function addComment will be executed. Where the addComment in the case where the user wrote something enables the button Reply and then I add an event listener on the Reply button for when the user will click on it. When the user clicks on the button Reply the function handleSubmit will be executed. The handleSubmit function will gather the text the user added as a comment and will send it to the server side.

An important step that the handleSubmit function does inside it is the setCommentadded(true) which updates the commentadded state. With this the useEffect hook is triggered which has as a dependency the commentadded. We do this because we want every time the user makes a new comment this comment to be displayed in real time on the screen of the user with the already existing comments without the user needing to reload the page every time for these changes to appear. So every time the commentadded changes the useEffect will run displaying the new comment on the screen of the user in real time without needing to reload the page for these changes to appear.

Because the user has the ability to make a comment to comment or also a comment to comment to comment etc. having now gathered all the comments that are not “nested” that have been made on this post at the given moment we call the component Comment (see file Comment.js frontend) for each comment (that is not “nested”) of the specific post.

The file Comment.js is located inside the folder /*frontend*/src/components

## File Comment.js (frontend part)

Now the file Comment.js can be called from a post for a specific comment on this post or from a comment (this comment may be “nested” or not) for a specific “nested” comment that has been made on this comment.

So this file is responsible for displaying the content of the comment that we pass as an argument to the function Comment, for displaying the number of likes it may have and for displaying the “nested” comments it may have.

I.e. it is responsible for whatever is related to this comment.

Initially we display the content of the comment. Next we create an event handler the onClick for click events and when the like button is pressed by the user the function addLike will be executed and given the current state of the liked button i.e. whether it is clicked or not we will set the color of the button as blue or grey. Also for this button a unique id is created as like\_ + comm.\_id so that we know which button we are referring to.

So when the user presses like on the comment the function addLike is executed. Which based on whether this comment is nested or not and on the current state of the button (i.e. liked or not) after it sends the new changes to the correct endpoint of the server side changes the color of the button based on the new change.

Now we go to the case where the user makes a comment on this comment, initially as with the like button so here too on the “nested” comment button we create a unique id as comm.\_id + \_button so that we know which button we are referring to and we set a handler the onChange where if the user writes something as a “nested” comment the function addComment\_to\_Comment will be executed. Where the addComment\_to\_Comment in the case where the user wrote something enables the button Reply and then adds an event listener on the Reply button for when the user will click on it. When the user clicks on the button Reply the function handleSubmit will be executed. The handleSubmit function will gather the text the user added as a “nested” comment and will send it to the server side.

An important step that the handleSubmit function does inside it is the setCommentadded(true) which updates the commentadded state. With this the useEffect hook is triggered which has as a dependency the commentadded. We do this because we want every time the user makes a new “nested” comment this “nested” comment to be displayed in real time on the screen of the user with the already existing comments (“nested” or not) without the user needing to reload the page every time for these changes to appear. So every time the commentadded changes the useEffect will run displaying the new “nested” comment on the screen of the user in real time without needing to reload the page for these changes to appear.

Because the user has the ability to make a comment on “nested” comments but also a comment to comment to comment etc. having now gathered all the comments that are “first-level nested” that have been made on this post at the given moment we call the component Comment (i.e. we stay in the same file as now) for each comment that is “first-level nested” of the specific post. As you can see the same logic will also be executed for the comments to comment to comment etc.

## File comment.js (backend part)

The comment.js file is located in the backend directory of the exercise inside the directory routes.

And it contains all the endpoints we are directed to from the frontend side when we want:

a) to save a comment

b) to get the comments (not the “nested” comments) for a specific post

c) to save a “nested” comment

d) to get for a specific comment all the “nested” comment that have been made on this comment

e) to store a like from a specific user on a specific comment that is not “nested”

f) to store a “dislike” from a specific user on a specific comment that is not “nested”

g) to store a like from a specific user on a specific “nested” comment

h) to store a “dislike” from a specific user on a specific “nested” comment

I.e. this file contains all the endpoints that concern the comments of the exercise

The file comment.js is located inside the folder /*backend*/routes

## File post.js (backend part)

The post.js file is located in the backend directory of the exercise inside the directory routes.

And it contains all the endpoints we are directed to from the frontend side when we want:

a) to store a post in the database whether it contains text or it contains one or more multimedia or any other combination of the above.

For each multimedia if this post has it we say in which directory this multimedia should be stored and with what name it should be stored.

In the part of which directory it should be stored we have inside the backend directory the directories videos, audios and pictures for the videos, audios and pictures that a post may contain.

In the part of with what name this multimedia should be stored the name will be of the form id\_counter.extension where id is the unique id of the post it belongs to, the counter is a number that indicates the number of the multimedia it has in this post and the extension contains the extension of the multimedia respectively.

b) to get specific posts for a specific user.

With the implementation of Question 12 we return for a specific user posts in descending order according to the value of the matrix\_factorization it produced for this user and for these posts.

But now the following problem arises if a user or some friend of the user creates a new post this post will not appear on the screen of the user directly because the matrix\_factorization will first need to be calculated so with the function get\_new\_Posts I get all the posts of the user and of the friends of the user and checking whether they exist in the posts we had gotten at the start from Question 12 I delete them from this array in which we had stored them so that we do not have duplicates. In this way I display with priority the posts of the user and of the friends of the user and then all the remaining posts I have from Question 12.

Note:\
In this endpoint I use a flag the flag\_new\_posts because in Question 5 I had made a method to get posts for a user. But with the matrix\_factorization (Question 12) the method I had thought of for Question 5 was not needed but I decided to keep them both separating them with the use of “if and else” on the flag flag\_new\_posts.

In my own method (see in the same file the function getPosts) for a user it returns all their own posts, the posts of their friends, the posts that their friends liked as well as the posts where their friends liked some comment (whether it is a “nested” comment or not).

c) to store a like from a specific user on a specific post

d) to store a “dislike” from a specific user on a specific post

As you can see this file contains all the endpoints that concern the posts of the exercise

The file post.js is located inside the folder /*backend*/routes

# Message exchange system

Backend:

models/Messages.js:The schema of the messages for the chat,messages: text(string), users-->[from,to] and sender so that we know who sent the message.When we send a message we create 2 messages the [from,to] and [to,from], so from the logged in user we can search in the messages for the [logged in user id,to] and it returns all the messages between logged in user and to and we find from the sender who sent the message.

messages.js:

app.get('/api/getmessages'):We find all the messages between the from which is the logged in user and the to,we do a filtering in the projectedMessages, the fromself is whether the logged in user sent the message or is the receiver.

app.get('/api/getM'):It is for the list of the frontend with the users and the last message they exchanged. It returns a dictionary with keys the id of the users and values the last message they exchanged.

app.get('/api/getUsers'):It returns all the users for the list with the messages.

app.post('/api/messages'):It creates the message in the database.

Frontend:

Chat.js:

useEffect fetchData:It does fetch(/api/getUsers) and calls setData to set in the data the users and in the currentUser the logged in user.The setTo is to start running the use effect fetchL getM for each new user that is inserted.The count is to set in the getM the to which is the user in the list with the last message that the currentUser exchanged,when this changes the fetchL is called with query to in order to find the last message of the current user with the user to.The chatOpen runs only if the chat has been opened from the personal page where a user has been selected for chat.

useEffect fetchL:It does fetch(/api/getM) and finds the last message of the current user with the user to,if it has changed then it does setData3(data3) and the change appears in the frontend. It changes the to through the count and so it checks cyclically whether one of the other users has a new last message.

fetchSearch:It takes the value from the search bar and searches in the list with the users

useEffect fetchData2:It calls the fetch(/api/getmessages) which runs continuously to display the new messages of the current user with the user2.The user2 is the user we chose to chat with from the list with the users. It also calls the f(data) which sets the to so that the list with the last messages is updated if there is a new message.

handleChange:It is called when we write in the search bar and it calls the fetchSearch.

handlemsgchange:It is called when we write in the message box.

chathandler:It is called when we click a user from the list with the users for chat. It sets the flags to load the appropriate content of the frontend(it opens the chat).

msghandler:It posts the message to the database.

The query parameters are for opening the chat when a user is selected from the personalPage.js

For css we use mdbootstrap.

# Network

Backend:

connections.js:

app.get(/api/getUsersData):It is called from the PersonalPage with query the id of the user to get the data of the user and the connections,so that if they are friends(connected) it also displays the private data.

app.post('/api/getconnections'):For each user it checks whether they are connected,whether a request has been sent to them,whether they have sent a request and whether no request has been sent.

The usersList is for when no request has been sent between two users and therefore they can press connect in the frontend.

The disconnectList is for when the users are connected and in the frontend they can press disconnect.

The pending is the list with those who have sent them a request and therefore they can press accept or decline in the frontend.

The pending2 is the list with the users to whom they have sent a request and therefore they can press cancel in the frontend.

app.post('/api/connections'):It is for creating a new connection, we create both from,to and to,from so that we can get all the information searching only with the from.

app.patch('/api/addconnection'):It sets the connect to 1 in the database which means that the request was accepted.

app.patch('/api/deleteconnection'):It deletes a connection.

Frontend:

ConnectionPage.js:

UseEffect fetchData:It calls fetch(api/getUsers),it sets the users and the currentUser(logged in user).

UseEffect fetchConnections:It calls fetch(api/getconnections) and it sets the usersList, pending,pending2 and disconnectList.

handleChange:It takes the input of the search bar and searches for the users.For each list it calls the User component,taking as parameters the user and the pending flag which takes 4 values one for each of the 4 lists that the getConnections returns.

UserCard.js:

`` const link = `/personal?id=${user._id}&name=${user.name}` ``,if we click on the image of a user then we can go to the page with their personal information(\<a href={link}).

connectHandler:If pending flag = 0 we can send a connect request and we call the fetch(api/connections). If pending flag = 2 we are connected so we can disconnect and the fetch(api/deleteconnection) is called.\
If pending flag = 3 we can cancel the request since it has not been accepted yet and the fetch(api/deleteconnection) is called.

acceptHandler:If pending flag = 4 a request has been sent to us and we can accept and the fetch(api/addconnection) is called.

declineHandler:If pending flag = 4 a request has been sent to us and we can decline and the fetch(api/deleteconnection) is called.

# CHAPTER 12

## Matrix Factorization

In the folder backend inside the folder models we have the file MatrixFactorization.js

This file is used for Question 12. And it represents a cell that is identified by the id of a user and the id of a post (both of which ids are unique for each user and for each post respectively) and this cell contains for this post the score (star\_value) it has gathered for this user. This cell belongs to a matrix of size M \* N , where M is the number of users and N the number of posts.

Now the Matrix Factorization algorithm is implemented in the file matrix\_factorization.js

The file matrix\_factorization.js is located inside the folder /*backend/*routes

What needs a further explanation is the way in which I initialize this matrix.

We have 9 criteria (conditions) which a specific post can satisfy for a specific user.

The highest total initial value that this post can gather for this user is 12.

These 9 criteria are the following:

1) If this user has liked this post + 2 points
2) If this post is a post of a friend of theirs + 1 point
3) If this user has commented on this post + 1 point
4) If this user has liked (either this post or a comment of the post) and commented (either a simple comment on the post or a “nested” comment on the post) + 2 points
5) If this post is their own + 2 points
6) If this user for this specific post has made a like (on the post itself or on a comment of the post) where this post is of a friend of theirs + 1 point
7) If this user for this specific post has made a comment (on this post itself or a “nested” comment on this post) where this post is of a friend of theirs + 1 point
8) If the specific post has many likes + 1 point
9) If the specific post is from a friend of a friend of theirs + 1 point

So the value that will later be stored as star\_value in the model Post\_\_Star\_Value\_\_User is initialized in this way and in the fields for\_user and for\_post of the model we pass the unique object ids of the specific user and post respectively.

This process will be repeated for each user and for each post we have.

This whole process in the file matrix\_factorization.js corresponds to the code lines 30-298

After the initialization of this matrix in lines 306-390 the algorithm is implemented according to the theory of the course. So to a user articles will be displayed in descending order according to their value from the matrix\_factorization algorithm for this user, giving however priority to their own articles and to the articles of their friends.

I have made the matrix\_factorization algorithm able to be calculated either when you write the link below <https://localhost/matrix_factorization> in a browser I used this for obvious debugging purposes i.e. to see whether it ran correctly during the implementation of Question 12 so I decided to leave it as a “feature” or otherwise it will be executed/calculated automatically every hour at 25 minutes past the hour. For the latter see in the backend directory the file server.js line 97.

## Creation of random artificial data

In the backend directory in the file matrix.js we create the artificial data of Question 12.

Specifically inside the directory backend there is the directory database where there are various files in the directories audios, pictures, videos from which some will be chosen randomly for the creation of a post by a user.

In the directory pics there are various photos from which one will be chosen randomly for each user as profile\_pic

The .json files first-names.json and names.json contain first names and last names that will be chosen randomly for each user.

Having mentioned these we return to the file matrix.js

We initially create 10 users (code line 391) and put various random values in the fields of the model User for each user using the directory pics and the json files that were mentioned previously.

Now each user can make from 0 to 5 posts (code line 407). Where each post can contain either text or videos or photos or audios or any other combination of the above.

Then each user can have from 0 to 5 random friends (code line 231).

Next each user can randomly make from 0 to 5 comments in total on random posts that appear on their screen (code line 265).

Also each user can randomly make from 0 to 2 “nested” comments in total (code line 293) on random posts that contain comments and then one of these comments on this post is chosen randomly for the specific user to make a “nested” comment on this comment.

Finally each user can randomly make from 0 to 5 likes on random posts or also comments.

In the above way I create the artificial data.

To create this artificial data it is enough to write in a browser the link\
<https://localhost/matrix/createdb>

So the creation of the artificial data can be done in the above way or you can also create them manually yourself.

For debugging purposes each user of the ready-made data has the password 11!!AAaa

# Conclusion

Given that we had not worked with web development before we believe that we did well.

The only difficulty that one team member encountered was in question 5 because he had not worked with these before so it seemed huge to him characteristic expression “When does this question end”.

How he dealt with it with tutorials on youtube, google and a lot of thought about how this whole question would be constructed / implemented.
