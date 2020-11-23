var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');

router.get('/', function (req, res) {
        res.render('tmpl/inspection/list.html');
});

router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
          
    db.query.getInspectionVen({company:req.session.user.cur_company,status:'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit"> Edit  </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                    arrObj.data.push([data[0][i].label,action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});

router.get('/new', function (req, res) {
    res.render('tmpl/inspection/new.html');
});

router.post('/save', function (req, res) {
    var rb = req.body;
    if (typeof rb.iid !== 'undefined' ) {
        db.query.updateDb('inspection', {label: rb.label,modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, rb.iid, function (sid) {
            generateLogFile({user: req.session.user.id, type: 'inspection modification', time: new Date(), refer_id: rb.iid});
        });
    } else {
        db.query.insertDb('inspection', {label: rb.label,company: req.session.user.cur_company,created_by: req.session.user.id, modify_by: req.session.user.id}, function (sid) {
            generateLogFile({user: req.session.user.id, type: 'inspection creation', time: new Date(), refer_id: sid});
        });
    }
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.get('/edit/:id', function (req, res) {
    db.query.selectDb('inspection'," id="+req.params.id,function(row){
        res.render('tmpl/inspection/edit.html', {row:row[0]});
    });
});

router.get('/delete/:id', function (req, res) {
    db.query.updateDb('inspection', {status: 'delete',  modify_by: req.session.user.id,modification_date:new Date().toMysqlFormat()},req.params.id, function (aid) {
        generateLogFile({user:req.session.user.id,type:'inspection delete',time:new Date(),refer_id:req.params.id});
        db.query.selectDb('inspection'," company=" + req.session.user.cur_company + "  AND status='active' ",function(su){
            res.render('tmpl/inspection/list.html',{su:su});
        });
    });
});

module.exports = router;