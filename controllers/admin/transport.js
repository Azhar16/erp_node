var express = require('express')
        , router = express.Router()
        , config = require('config')
        , jsonfile = require('jsonfile')
        , db = require('../../models/db/base')
        , moment = require('moment');

router.get('/new', function (req, res) {
    res.render('tmpl/transport/new.html');
});

router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.insertDb('transport', { title: rb.title, manner: rb.manner, transporter_name: rb.transporter_name,cn_no:rb.cn_no,vechicle_no:rb.vechicle_no,company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'Transport creation', time: new Date(), refer_id: cid});
    });
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.get('/bycompany',function(req, res){
    db.query.selectDb('transport', " company="+req.session.user.cur_company, function (row) {
        res.end(JSON.stringify(row));
    });
});

module.exports = router;