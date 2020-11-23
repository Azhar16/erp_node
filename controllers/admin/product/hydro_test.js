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
    res.render('tmpl/hydro_test/list.html');
});

router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
          
    db.query.gethydrotestVen({company:req.session.user.cur_company,status:'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit_code"> Edit  </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                    arrObj.data.push([data[0][i].class,data[0][i].body,data[0][i].seat,data[0][i].back_seat,data[0][i].seat_air, action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});

router.get('/new', function (req, res) {

        res.render('tmpl/hydro_test/new.html');
    });

router.post('/save', function (req, res) {
    var rb = req.body;
     if (rb.uid != undefined) {
            var pvar = {class:rb.clas,body:rb.body,seat:rb.seat,back_seat:rb.back_seat,seat_air:rb.seat_air};
            db.query.updateDb('hydro_test', pvar, rb.uid, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'hydro test modification', time: new Date(), refer_id: rb.uid});
               res.end(JSON.stringify({'code': rb.uid, 'msg': 'Success'}));
            });
        }
           else{ 
             db.query.insertDb('hydro_test', {class:rb.clas,body:rb.body,seat:rb.seat,back_seat:rb.back_seat,seat_air:rb.seat_air,company: req.session.user.cur_company}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'hydro test creation', time: new Date(), refer_id: cid});
                
                res.end(JSON.stringify({'code': cid, 'msg': 'Success'}));
            });
            
         }
         
});

router.get('/edit/:id', function (req, res) {
     db.query.selectDb('hydro_test', "status<>'delete' AND id=" + req.params.id , function (row) {
        res.render('tmpl/hydro_test/edit.html', {row: row[0]});
     });     
});

router.get('/delete/:id', function (req, res) {
        db.query.selectDb('hydro_test', " company=" + req.session.user.cur_company, function (row) {
          db.query.updateDb('hydro_test', {status: 'delete'}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'Unit delete', time: new Date(), refer_id: req.params.id});
        res.render('tmpl/hydro_test/list.html',{row:row});
     });
    });
});



module.exports = router;