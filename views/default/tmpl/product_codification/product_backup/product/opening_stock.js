var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');

router.get('/openingstock', function (req, res) {
	    db.query.selectCustomDb("SELECT DISTINCT(category) category FROM item WHERE status<>'delete' ORDER BY `category`", function (prodtype) {
    res.render('tmpl/opening_stock/new.html',{prodtype:prodtype});
  });
});
router.get('/getOpeningStock/:category', function (req, res) {
	db.query.selectCustomDb("SELECT i.id,i.code,i.specification,i.current_stock,os.rate,os.quantity FROM item i INNER JOIN opening_stock os ON i.id=os.item WHERE i.category='"+req.params.category+"'", function (dapp) {
        res.end(JSON.stringify(dapp));
    });
});
router.post('/openingStocksave', function (req, res) {
    var rb = req.body;
    for (var k in rb.data) {

        var newstock = parseInt(rb.data[k].ocq) + parseInt(rb.data[k].c - rb.data[k].oq);
        db.query.updateDbCustom('opening_stock', {rate: rb.data[k].d, quantity: rb.data[k].c}, "item='"+ rb.data[k].id +"'", function (cid) {});
        db.query.updateDbCustom('item', {current_stock: newstock}, "id='"+ rb.data[k].id +"'", function (cid) {});
     
    }
    generateLogFile({user: req.session.user.id, type: 'Opening Stock updated', time: new Date(), refer_id: req.session.user.cur_company});
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});



module.exports = router;




