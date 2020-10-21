const express = require("express");
const router = express.Router();
const auth = require('../middlewaare/auth')
const { check, validationResult } = require("express-validator");
 const User = require("../models/User") 
 const Contact = require("../models/Contact") 

//get a users contacts route GET api/contacts private access
router.get('/', auth, async(req, res) => {
    try {
        const contacts = await Contact.find({ user : req.user.id }).sort({ date : -1 });
        res.json(contacts);

    } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error'); 
    }
});

//ADD a users contacts route POST api/contacts private access
router.post('/', [ auth, 
    [ check("name", "Name is required").not().isEmpty() ]
], async (req, res) => {
    const errors = validationResult(req)

   if(!errors.isEmpty()){
       return res.status(400).json({ errors : errors.array() })
   }

   const { name, email, phone, type } = req.body;

   try {
       //create a new contact object
       const newContact = new Contact({
           name,
           email,
           phone,
           type,
           user :req.user.id
       })

       //save the new contact
       const contact = await newContact.save();
       res.json(contact);
   } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
   }

});
//UPDATE a users contacts route PUT api/contacts/:id private access
router.put('/:id', auth, async (req, res) => {
   const { name, email, phone, type} = req.body;

   //build an object for the update fields
   const contactFields = {};
   if(name) contactFields.name = name;
   if(email) contactFields.email = email;
   if(phone) contactFields.phone = phone;
   if(type) contactFields.type = type;

   try {
       let contact = await Contact.findById(req.params.id);

       if(!contact) return res.status(404).json({ msg : "Contact not found"});

       //make sure the user owns the account
       if(contact.user.toString() !== req.user.id){
           return res.status(401).json({ msg : "Not authorized"});
       }

       //find the contact using their id an
       contact = await Contact.findOneAndUpdate(req.params.id,
        { $set: contactFields},
        { new: true });
        res.json(contact);

   } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error');
   }
});
//DELETE a users contacts route DELETE api/contacts/:id private access
router.delete('/:id', auth, async (req, res) => {
    try {
        //looking for the contact using their id
        let contact = await Contact.findById(req.params.id);
 
        if(!contact) return res.status(404).json({ msg : "Contact not found"});
 
        //make sure the user owns the contact
        if(contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg : "Not authorized"});
        }
        await Contact.findByIdAndRemove(req.params.id);
        res.json({ msg:"contact removed" });

    } catch (err) {
     console.error(err.message);
     res.status(500).send('Server error');
    }
});
module.exports = router;