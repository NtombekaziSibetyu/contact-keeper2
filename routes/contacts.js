const express = require("express");
const router = express.Router();

//get a users contacts route GET api/contacts private access
router.get('/', (req, res) => {
    res.send('get all users contacts')
});

//ADD a users contacts route POST api/contacts private access
router.post('/', (req, res) => {
    res.send('add users contacts')
});
//UPDATE a users contacts route PUT api/contacts/:id private access
router.put('/:id', (req, res) => {
    res.send('update ausers contacts')
});
//DELETE a users contacts route DELETE api/contacts/:id private access
router.delete('/:id', (req, res) => {
    res.send('delete a users contacts')
});
module.exports = router;