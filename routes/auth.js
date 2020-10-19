const express = require("express");
const router = express.Router();

//get logged in user user route: api/auth Get method  private access
router.get('/', (req, res) => {
    res.send('get logged in user')
});

//authorise user and get token route: api/auth POST method public access
router.post('/', (req, res) => {
    res.send('log in user')
});

module.exports = router;