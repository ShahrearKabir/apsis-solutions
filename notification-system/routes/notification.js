var express = require('express');
var router = express.Router();

const{
    notificationList,
    notificationStore,
    notificationUpdate,
    notificationSettingsUpdate,
    notificationSettings
} = require ('../controller/notificationController');

router.get('/list/by/:profile_id', notificationList);
// router.post('/save', roleStore);
router.put('/update',notificationUpdate);
router.post('/settings/update', notificationSettingsUpdate);
router.get('/settings/by/:profile_id', notificationSettings);
// router.delete('/delete', roleDelete);

module.exports = router;

