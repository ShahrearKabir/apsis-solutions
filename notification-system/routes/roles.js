var express = require('express');
var router = express.Router();

const{
    rolesList,
    roleStore,
    roleUpdate,
    roleDelete
} = require ('../controller/rolesController');

router.get('/list', rolesList);
router.post('/save', roleStore);
router.put('/update',roleUpdate);
router.delete('/delete', roleDelete);

module.exports = router;

