var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/plan', require('./planlist'));
router.use('/requisition_plan', require('./requisition_plan'));

router.use('/', require('./plandashboard'));

module.exports = router;