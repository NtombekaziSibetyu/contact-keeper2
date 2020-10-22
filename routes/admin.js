const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const auth = require('../middlewaare/auth');
const router = express.Router();

//GET all the users
router.get('/', auth, async (req, res) => {
    try {
        //find the user logged in by the id
        const user = await User.findById(req.user.id).select("-password");
        //check if the logged in user is an admin
        if(user.role == "admin"){
            //find all the users in db an display
            let users = await User.find();
            res.json(users);
        } else {
            //deny access
            res.status(401).send('Acces denied');
        }
        
    } catch (err) {
       console.error(err.message)
       res.status(500).send('Server error')
    }
});

//update a users information
router.put('/:id',auth, async (req, res) => {
    const { name, email, password, role}  = req.body;
    //create an object for the updated user
    let userUpdate = {};
    try {
        if(name) userUpdate.name = name;
        if(email) userUpdate.email = email;
        if(role) userUpdate.role = role;
        if(password) {
           //generating salt for hashing password
            const salt = await bcrypt.genSalt(10);
            userUpdate.password = await bcrypt.hash (password, salt); 
        }

        //get the user updating the info
        let user = await User.findById(req.user.id).select("-password");
        //check if its admin
        if(user.role === "admin"){
            //find the user to be updated and update
            user = await User.findOneAndUpdate(req.params.id,
                { $set: userUpdate},
                { new: true });
                res.json(user);
        }
        else {
            res.status(401).send('Access denied');
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;