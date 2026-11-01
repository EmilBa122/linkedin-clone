const express = require('express');
const User = require('../models/User'); // Import the User model

const Messages = require("../models/Messages");

const app = express.Router();

app.get('/api/getmessages', async (req, res,) => {
  try {
    if (req.query.from){
        //const { from, to } = req.query.q;
        const from = req.query.from
        const to = req.query.to
        //console.log(from)
        const messages = await Messages.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
        
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
            time: new Date(msg.createdAt).toLocaleString(),
            to_: to
          };
        });
        return res.json(projectedMessages);
  };
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/getM', async (req, res) => {
  console.log('a',req.query.to)
  if (req.query.from != 'undefined' && req.query.to != 'undefined'){
    //const { from, to } = req.query.q;
    const from = req.query.from
    const to = req.query.to
    //console.log('a',from)
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    var dict = {}; //.toJSON()
   
    if (messages.length > 0){
      dict[to] = messages[messages.length-1].message.text;
    }
    else{
      dict[to] = '';
    }
    //console.log(dict)
     
    return res.json(dict);
    
  };
});

app.get('/api/getUsers', async (req, res) => {
    try {
      //console.log(req.user._id)
        const users = await User.find({ _id: { $ne: req.user._id },isAdmin: "" }).select([
          "email",
          "first_name",
          "last_name",
          "_id",
          "name",
          "profile_pic",
        ]);
 
        return res.json([users,req.user]);
          
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
  });

app.post('/api/messages', async (req, res,) => {
  try {
    const { from, to, message} = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app; 