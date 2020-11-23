var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/asset', require('./asset'));
router.use('/assettype', require('./assettype'));
router.use('/depapp', require('./depapp'));
router.use('/assetpartner', require('./assetpartner'));
router.use('/acure_asset', require('./acure_asset'));
router.use('/issue_asset', require('./issue_asset'));
router.use('/return_asset', require('./return_asset'));
router.use('/asset_rate', require('./asset_rate'));
router.use('/asset_sale', require('./asset_sale'));

router.use('/', require('./assetdashboard'));

module.exports = router;