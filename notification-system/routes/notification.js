var express = require('express');
var router = express.Router();

const{
    notificationList,
    notificationStore,
    notificationUpdate
} = require ('../controller/notificationController');

router.get('/list/by/:profile_id', notificationList);
// router.post('/save', roleStore);
router.put('/update',notificationUpdate);
// router.delete('/delete', roleDelete);

module.exports = router;

