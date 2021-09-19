var express = require('express');
var router = express.Router();
const jwtAuth = require('../middleware/auth');
const {
    userList,
    userInfo,
    userUpdate,
    userDelete
} = require("../controller/userController");

router.get('/list', userList);
router.get('/info/by/:user_id', userInfo);
router.put('/update', userUpdate);     //jwtAuth.authenticateJWT, jwtAuth.isAdmin, 
router.delete('/delete', jwtAuth.authenticateJWT, jwtAuth.isAdmin,  userDelete);

module.exports = router;