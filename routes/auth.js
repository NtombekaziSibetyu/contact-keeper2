const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require("../middlewaare/auth")
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

//get logged in user user route: api/auth Get method  private access
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//authorise user and get token route: api/auth POST method public access
router.post('/',[
    check("email", " Please include avalid email").isEmail(),
    check("password","Password is required").exists()
], 
async (req, res) => {
    const errors = validationResult(req)
    //check for errors
   if(!errors.isEmpty()){
       return res.status(400).json({ errors : errors.array() })
   }
   //take the email and password from the body
   const { email, password } = req.body;

   try {
       //get users email from the User model and compare with provided email
       let user = await User.findOne({ email })

       //if it does not match the users email
       if(!user){
           return res.status(400).json({ msg: "Invalid credentials"});
       }

       //if the email match check if the passowrd match
       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch){
        return res.status(400).json({ msg: "Invalid credentials"});
    }
    
    const payload = { user : {
        id : user.id
    }}

    jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn : 3600000
    }, ( err, token) => {
        if(err) throw err;
        res.json({ token });
    })

   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error');
   }
});

module.exports = router;