var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');

router.get('/assetrate', function (req, res) {
    res.render('tmpl/asset_rate/list.html');
});
router.get('/getAssetRate', function (req, res) {
	db.query.selectCustomDb("SELECT * FROM assetrate WHERE status<>'delete' AND company='"+req.session.user.cur_company+"' ", function (arate) {
        res.end(JSON.stringify(arate));
    });
});
router.post('/ratesave', function (req, res) {
    var rb = req.body;
    for (var k in rb.data) {
        if(rb.data[k].id != ''){
        db.query.updateDbCustom('assetrate', {wdv: rb.data[k].c, slm: rb.data[k].d,useful_life:rb.data[k].e}, "id='"+ rb.data[k].id +"'", function (cid) {});
        generateLogFile({user: req.session.user.id, type: 'Asset rate updated', time: new Date(), refer_id: req.session.user.cur_company});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
        }
        else{
        db.query.insertDb('assetrate', {company:req.session.user.cur_company,wdv: rb.data[k].c, slm: rb.data[k].d,useful_life:rb.data[k].e}, function (cid) {});  
        generateLogFile({user: req.session.user.id, type: 'Asset rate inserted', time: new Date(), refer_id: req.session.user.cur_company});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
        }
    }
    
});

module.exports = router;




