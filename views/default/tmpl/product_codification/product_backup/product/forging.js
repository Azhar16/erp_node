var express = require('express')
        , router = express.Router()
        , config = require('config')
        , jsonfile = require('jsonfile')
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');

router.get('/', function (req, res) {
    res.render('tmpl/forging/list.html');
});

router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
          
    db.query.getForgingVen({company:req.session.user.cur_company,status:'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
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
                    arrObj.data.push([data[0][i].name, action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});

router.get('/new', function (req, res) {
        res.render('tmpl/forging/new.html');
    });

router.post('/save', function (req, res) {
    var rb = req.body;
     if (rb.fid != undefined) {
            var pvar = {name:rb.forging_name,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('forging', pvar, rb.fid, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'Forging  modification', time: new Date(), refer_id: rb.cid});
               res.end(JSON.stringify({'code': rb.fid, 'msg': 'Success'}));
            });
        }
           else{ 
             db.query.insertDb('forging', {name:rb.forging_name,company: req.session.user.cur_company,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'forging creation', time: new Date(), refer_id: cid});
                
                res.end(JSON.stringify({'code': cid, 'msg': 'Success'}));
            });
            
         }
         
});

router.get('/edit/:id', function (req, res) {
     db.query.selectDb('forging', "id=" + req.params.id , function (row) {
        res.render('tmpl/forging/edit.html', {row: row[0]});
  });
});

router.get('/delete/:id', function (req, res) {
        db.query.selectDb('forging', " company=" + req.session.user.cur_company, function (row) {
             db.query.updateDb('forging', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'forging delete', time: new Date(), refer_id: req.params.id});
        res.render('tmpl/forging/list.html',{row:row});
     });
    });
});





module.exports = router;