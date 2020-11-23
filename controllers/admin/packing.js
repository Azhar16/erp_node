var express = require('express')
        , router = express.Router()
        , config = require('config')
        , jsonfile = require('jsonfile')
        , db = require('../../models/db/base')
        , moment = require('moment');

router.get('/new', function (req, res) {
    res.render('tmpl/packing/new.html');
});

router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.insertDb('packing', {date: moment(rb.date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"), listno: rb.listno, company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'packing creation', time: new Date(), refer_id: cid});
    });
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.get('/bycompany',function(req, res){
    db.query.selectDb('packing', " company="+req.session.user.cur_company, function (row) {
        res.end(JSON.stringify(row));
    });
});

module.exports = router;