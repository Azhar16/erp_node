var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/customer', require('./customer'));
router.use('/vendor', require('./vendor'));
router.use('/', require('./dashboard'));

module.exports = router;