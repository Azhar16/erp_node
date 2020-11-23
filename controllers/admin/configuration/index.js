var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/settings', require('./settings'));
router.use('/user', require('./user'));

router.use('/', require('./dashboard'));

module.exports = router;