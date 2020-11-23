var express = require('express')
        , router = express.Router()
        , config = require('config')
        , formidable = require('formidable')
        , fs = require('fs')
        , jsonfile = require('jsonfile')
        , path = require('path')
        , nodemailer = require('nodemailer')
        , db = require('../models/db/base')
        , moment = require('moment')

/* login */
router.use('/login', require('./login'));

/* admin part */
router.use('/dashboard', require('./admin/dashboard'));
router.use('/settings', require('./admin/settings'))
router.use('/item', require('./admin/item'));
router.use('/sales_workorder', require('./admin/sales_workorder'));
router.use('/transport', require('./admin/transport'));
router.use('/customer', require('./admin/customer'));
router.use('/packing', require('./admin/packing'));
//router.use('/componentcategory', require('./admin/componentcategory'));

router.use('/salesagent', require('./admin/salesagent'));

//router.use('/offer', require('./admin/offer'));
//router.use('/enquiry', require('./admin/enquiry'));
//router.use('/workorder', require('./admin/workorder'));

router.use('/user', require('./admin/user'));
router.use('/report', require('./admin/report'));
router.use('/product', require('./admin/product'));
router.use('/sales', require('./admin/sales'));
router.use('/plan', require('./admin/plan'));
router.use('/asset', require('./admin/asset'));
router.use('/purchase', require('./admin/purchase'));
router.use('/configuration', require('./admin/configuration'));

//router.use('/prod_specification', require('./admin/prod_specification'));
//router.use('/prod_feature', require('./admin/prod_feature'));
//router.use('/prod_codification', require('./admin/prod_codification'));
//router.use('/rawitem', require('./admin/rawitem'));
//router.use('/serviceitem', require('./admin/serviceitem'));


router.get('/', function (req, res) {
    //console.log(req.session.employee);
     if (typeof (req.session.user) !== 'undefined' && req.session.user.id > 0) {
        res.redirect(config.get('base_url')+"dashboard");
    } else {
        res.render('login.html');
    }
});

router.get('/ajaxlogincheck', function (req, res) {
     if (typeof (req.session.user) !== 'undefined' && req.session.user.id > 0) {
         jsonfile.readFile('settings/'+req.session.user.id+'.json', function (err, usavedrole) {
            res.end(JSON.stringify(usavedrole));
         });
    } else {
        res.render('login.html');
    }
    
    
});



module.exports = router;