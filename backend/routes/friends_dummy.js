const express = require('express');
const app = express.Router();
const Connections = require('../models/Connections');

async function createFriendshipdummy(userA_id, userB_id) {
    try {
        if (!userA_id || !userB_id) 
        {
            console.log("User IDs are required to create a friendship");
            return;
        }

        const existingFriendship = await Connections.findOne({
            $or: [
                { from: userA_id, to: userB_id },
                { from: userB_id, to: userA_id } 
            ],
            connect: 1
        });

        if (existingFriendship) 
        {
            console.log('Friendship already exists between these users');
            return;
        }

        const newFriendship = new Connections({ from: userA_id, to: userB_id, sender: userA_id, connect: 1 });
        await newFriendship.save();
    } catch (error) {
        console.error('Error creating friendship:', error);
    }
}

async function findFriends(userA_id) {
    try {
        const friendships = await Connections.find({
            $or: [
                { from: userA_id },
                { to: userA_id }
            ],
            connect: 1
        });
        
        const friends = friendships.map(friendship => {
            
            if (friendship.from.toString() === userA_id.toString()) 
            {
                return friendship.to;
            } 
            else 
            {
                return friendship.from;
            }
        });

        // Remove duplicates
        const unique_friends = Array.from(new Map(friends.map(id => [id.toString(), id])).values());

        return unique_friends;

        // console.log("+++++++++++++++++");
        // console.log(friends);
        // console.log("+++++++++++++++++");

        // return friends;
    } catch (error) {
        console.error('Error finding friends:', error);
        return [];
    }
}

module.exports = 
{
    createFriendshipdummy,
    findFriends
};


