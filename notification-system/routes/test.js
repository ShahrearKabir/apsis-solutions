var express = require('express');

var router = express.Router();

router.get('/save',()=>{
    console.log("this is test route");

});

module.exports = router;