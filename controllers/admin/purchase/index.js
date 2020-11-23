var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/requisition_purchase', require('./requisition_purchase'));
router.use('/purchase_enquiry', require('./purchase_enquiry'));
router.use('/price_competitive', require('./price_competitive'));
router.use('/purchase_order', require('./purchase_order'));
router.use('/', require('./purchasedashboard'));

module.exports = router;