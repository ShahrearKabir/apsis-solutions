var express = require('express');
var router = express.Router();

const{
    leaveList,
    leaveStore,
    leaveUpdate,
    // roleDelete
} = require ('../controller/leaveController');

router.get('/list', leaveList);
router.post('/save', leaveStore);
router.put('/update',leaveUpdate);
// router.delete('/delete', roleDelete);

module.exports = router;

