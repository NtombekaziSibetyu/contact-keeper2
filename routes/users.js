const express = require("express");
const router = express.Router();
 const User = require("../models/User")

//register a user route Post api/users public access
router.post('/',
[check("name","name is required").not().isEmpty(),
check("email","").isEmail("Please enter a vaild email"),
check("password","Please enter a password with 6 or more characters").isLength({min:6})], 
(req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
       return res.status(400).json({ errors : errors.array()})
   }
   res.send("passed");
});

module.exports = router;