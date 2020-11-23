var express = require('express')
        , router = express.Router()
        , config = require('config')
        , formidable = require('formidable')
        , fs = require('fs')
        , jsonfile = require('jsonfile')
        , path = require('path')
        , nodemailer = require('nodemailer')
        , db = require('../../../models/db/base')
        , moment = require('moment')


router.get('/dashboard', function (req, res) {
    res.render('tmpl/configuration/view.html');
});

module.exports = router;