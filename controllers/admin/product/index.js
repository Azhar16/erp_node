var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/prod_specification', require('./prod_specification'));
router.use('/componentcategory', require('./componentcategory'));
router.use('/prod_feature', require('./prod_feature'));
router.use('/prod_codification', require('./prod_codification'));
router.use('/rawitem', require('./rawitem'));
router.use('/serviceitem', require('./serviceitem'));
router.use('/unit', require('./unit'));
router.use('/opening_stock', require('./opening_stock'));
router.use('/hydro_test', require('./hydro_test'));
router.use('/forging', require('./forging'));
router.use('/special_component', require('./special_component'));

router.use('/', require('./product'));





module.exports = router;