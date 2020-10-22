const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middlewaare/auth')
const { check, validationResult } = require("express-validator");
const User = require("../models/User")




//register a user route Post api/users public access
router.post('/',
[
    check("name","name is required").not().isEmpty(),
    check("email","Please enter a vaild email").isEmail(),
    check("password","Please enter a password with 6 or more characters").isLength({min:6})], 
async (req, res) => {
   const errors = validationResult(req);

   if(!errors.isEmpty()){
       return res.status(400).json({ errors : errors.array() })
   }

   const { name, email, password, role }  =  req.body;

   try {
       //use the email to check if the user exists
       let user = await User.findOne({ email });

       if(user) {
           return res.status(400).json({ msg : "User already exists" });
       }

       //create a new user object
       user = new User({
           name,
           email,
           password,
           role
       });

       //generating salt for hashing password
       const salt = await bcrypt.genSalt(10);
       user.password = await bcrypt.hash(password, salt);

       //save new user to db
       await user.save();


       const payload = { user : {
           id : user.id
       }};

       //create a token for the user
       jwt.sign(payload, config.get('jwtSecret'), {
           expiresIn : 3600000
       },
        ( err, token) => {
           if(err) throw err;
           res.json({ token });
       })
   } catch (err) {
       console.error(err.message)
       res.status(500).send('Server error')
   }
});



module.exports = router;