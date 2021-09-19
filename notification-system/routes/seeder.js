var express = require('express');
const { 
    seedSuperAdminEvents,
    // seedCitiesEvents,
    // seedCountriesEvents
} = require('../seeder/seederController');
// const jwtAuth = require('../middleware/auth');
var router = express.Router();

router.post('/super-admin/save', seedSuperAdminEvents);     //jwtAuth.basicAuth, 
// router.post('/cities/save', jwtAuth.basicAuth, seedCitiesEvents);
// router.post('/countries/save', jwtAuth.basicAuth, seedCountriesEvents);

module.exports = router;