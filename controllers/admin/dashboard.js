var express = require('express')
        , router = express.Router()
        , config = require('config')
        , formidable = require('formidable')
        , fs = require('fs')
        , jsonfile = require('jsonfile')
        , path = require('path')
        , nodemailer = require('nodemailer')
        , db = require('../../models/db/base')
        , moment = require('moment')

router.get('/', function (req, res) {
    if (typeof (req.session.user) == 'undefined') {
            res.redirect(config.get('base_url'));
        }else{
            res.render('dashboard.html');
        }
   
});

router.get('/view', function (req, res) {
    res.render('tmpl/dashboard/view.html');
});

module.exports = router;