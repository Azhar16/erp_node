var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/enquiry', require('./enquiry'));
router.use('/offer', require('./offer'));
router.use('/workorder', require('./workorder'));
router.use('/special_services', require('./special_services'));
router.use('/inspection', require('./inspection'));
router.use('/', require('./salesdashboard'));





module.exports = router;