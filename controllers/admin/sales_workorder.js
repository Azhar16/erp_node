var express = require('express')
        , router = express.Router()
        , config = require('config')
        , jsonfile = require('jsonfile')
        , db = require('../../models/db/base')
        , moment = require('moment');

router.get('/new/:cid', function (req, res) {
    res.render('tmpl/sales_workorder/new.html', {cid: req.params.cid});
});

router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.insertDb('sales_workorder', {date: moment(rb.date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"), order_no: rb.order_no, ref_no: rb.ref_no, customer: rb.cid, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'Work order creation', time: new Date(), refer_id: cid});
    });
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.get('/byid/:cid',function(req, res){
    db.query.selectDb('sales_workorder', " customer="+req.params.cid, function (row) {
        res.end(JSON.stringify(row));
    });
});

module.exports = router;