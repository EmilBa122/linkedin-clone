const express = require('express');
const User = require('../models/User'); // Import the User model

const Connections = require("../models/Connections");
const { connection, disconnect } = require('mongoose');

const app = express.Router();

app.get('/api/getUsersData', async (req, res) => {
    try {
        var id;
        console.log(req.query)
        if (req.query.id === 'null'){
            id = req.user.id;
        }
        else{
            id = req.query.id;
        }
        console.log('get',req.query.id); //undefined
        //const {to} = req.body;
        const user = await User.find({ _id: id}).select([
            "email",
            "first_name",
            "last_name",
            "_id",
            "name",
            "profile_pic",
          ]);

        const connection_= await Connections.find( 
            {from: req.user.id}, {to: id}, {connect: 1}
        )
       
       var con = 0;
       if (connection_.length > 0) con = 1;
       if (id === req.user.id) con = 1; 
       if (user) return res.json([user,con]);
       else return res.json({ msg: "Failed to get data" });
       } catch (error) {
           console.error(error);
           res.status(500).json({ error: 'Internal server error' });
       }
  
})

app.post('/api/getconnections', async (req, res) => {
    try{
        const users = req.body;
        //users.length
        if (users){
            //console.log('users',users);
            const from = req.user._id.valueOf();
            console.log('from',from);
            //find all collections with from
            const connection_= await Connections.find( {
                $or: [
                {from: from}, {to: from}
                ]})
                .populate("sender")
                .populate("from")
                .populate("to");
           
            var usersList = [];
            var count = 0;
            //console.log(users.length);
            users.map((user) => {
                // if connection
                //console.log('count',count);
                connection_?.map((con) => {
                    if (con.from._id.valueOf() === user._id){
                        count = 1;
                    }
                });
                if (count === 0){
                    usersList.push(user);
                }
                count = 0;
            });

            //console.log('con',connection_);
            //const
            var pendingList = [];
            var pendingList2 = [];
            var disconnectList = [];
            connection_?.map((con) => {
                if (from === con.from._id.valueOf()){
                    if (con.connect === 1){
                        disconnectList.push(con.to);
                    }
                    else{
                        if (con.sender._id.valueOf() === con.to._id.valueOf()){
                            pendingList.push(con.to);
                        }
                        else{
                            if (con.sender._id.valueOf() === from){
                                pendingList2.push(con.to);
                            }
                        };
                    };
                }

            });

            return res.json([usersList,pendingList,disconnectList,pendingList2]);
        };

    } catch (error) {
        
        res.status(500).json({ error: 'ERROR' });
      }
});


app.post('/api/connections', async (req, res) => {
    try {
      const {to, connect} = req.body;
      const from = req.user._id.valueOf();
      console.log('con from',from);
      console.log('con to',to);
      const data = await Connections.create({
        from: req.user._id.valueOf(),
        to: to,
        sender: from,
        connect: connect,
      });

      const data2 = await Connections.create({
        from: to,
        to: req.user._id.valueOf(),
        sender: from,
        connect: connect,
      });

      if (data && data2) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
      }
  });

app.patch('/api/addconnection', async (req, res) => {
    try {
        const from = req.user._id.valueOf();
        console.log('addcon from',from);
        //const {to} = req.body;
        console.log('id',req.body.id);
        
        const update = {
          connect: 1,
        };
        console.log('from',from);

        const data = await Connections.findOneAndUpdate({
             from: req.body.id,
             to: from
         //{'from': to}, {'to': from} 
         }, update,{
             new: true
           }).exec();
        const data2 = await Connections.findOneAndUpdate({
           from: from, 
           to: req.body.id
        //{'from': to}, {'to': from} 
        }, update,{
            new: true
            });
       //console.log('update', data)
  
       if (data) return res.json({ msg: "updated add connection" });
       else return res.json({ msg: "Failed to updata add connection" });
       } catch (error) {
           console.error(error);
           res.status(500).json({ error: 'Internal server error' });
       }
  
});

app.patch('/api/deleteconnection', async (req, res) => {
    try {
      const from = req.user._id.valueOf();
      

      const data = await Connections.deleteOne({
        from: req.body.id, 
        to: from
       //{'from': to}, {'to': from} 
       });

      const data2 = await Connections.deleteOne({
        from: from, 
        to: req.body.id
       //{'from': to}, {'to': from} 
       });
     console.log('delete', data)

     if (data && data2) return res.json({ msg: "deleted " });
     else return res.json({ msg: "Failed to delete" });
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Internal server error' });
     }

});



module.exports = app;