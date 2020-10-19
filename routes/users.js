const express = require("express");
const router = express.Router();

//register a user route Post api/users public access
router.post('/', (req, res) => {
    res.send('register a user')
});

module.exports = router;