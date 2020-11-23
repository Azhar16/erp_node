var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');

router.get('/depreciation', function (req, res) {
	db.query.selectCustomDb("SELECT DISTINCT(year) year FROM assettype WHERE type='depreciation' AND status<>'delete' ORDER BY `year`", function (fyear) {
        db.query.selectCustomDb("SELECT * FROM assettype WHERE status<>'delete'", function (atype) {
    res.render('tmpl/depreciationaappreciation/depreciation.html',{year:fyear,atype:atype});
    });
  });
});
router.get('/getDepreciationRate/:atype', function (req, res) {
	console.log('iid '+req.params.atype);
    db.query.selectCustomDb("SELECT att.id,att.name,att.useful_life,att.type,dr.id as depid,dr.usefull_life as deplife,dr.company_act,dr.income_tax FROM assettype att LEFT JOIN depreciation_rate dr ON att.id = dr.assettype WHERE att.id='"+req.params.atype+"' AND att.status<>'delete'", function (dapp) {
        console.log(dapp);
        res.end(JSON.stringify(dapp));
    });
});
router.post('/dpreciationsave', function (req, res) {
    var rb = req.body;
    for (var k in rb.data) {
        console.log("id "+rb.data[k].id);
        if(rb.data[k].id != 'undefined' && rb.data[k].id != ''){
        db.query.updateDbCustom('depreciation_rate', {income_tax: rb.data[k].d, company_act: rb.data[k].c,usefull_life:rb.data[k].e,assettype:rb.data[k].atype}, "id='"+ rb.data[k].id +"'", function (cid) {});
        }
        else{
         db.query.insertDb('depreciation_rate', {company:req.session.user.cur_company,income_tax: rb.data[k].d, company_act: rb.data[k].c,usefull_life:rb.data[k].e,assettype:rb.data[k].atype}, function (cid) {});   
        }
    }
    generateLogFile({user: req.session.user.id, type: 'Depreciation Value updated', time: new Date(), refer_id: req.session.user.cur_company});
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

module.exports = router;




