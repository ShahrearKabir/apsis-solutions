var express = require('express');
var router = express.Router();
const jwtAuth = require('../middleware/auth');
const {
    login,
    userStore,
} = require("../controller/userController");

router.post('/signin', login)
router.post('/signup', userStore);

module.exports = router;