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
        res.render('tmpl/special_component/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getSpecialCompVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
               var action = '<div class="btn-group">'
               action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
               action += '<div class="dropdown-menu">'
               action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit"> Edit </a>'
               action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
               action += '</div>'
               action += '</div>'
            arrObj.data.push([data[0][i].name,data[0][i].type,data[0][i].size,data[0][i].saf_no, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/new', function (req, res) {
        res.render('tmpl/special_component/new.html');
});
router.get('/edit/:id', function (req, res) {
     db.query.selectDb('special_component', " id=" + req.params.id , function (row) {
        res.render('tmpl/special_component/edit.html', {row: row[0]});
   });
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('product_feature', "id=" + req.params.id, function (sl) {
      db.query.deleteDb('special_component', "id='"+req.params.id+"'", function (cid) {
        generateLogFile({user: req.session.user.id, type: 'special component delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });
                 
        });
});
router.post('/save', function (req, res) {
    var rb = req.body;
    console.log("psid "+rb.sid);
    console.log("type "+rb.stype);
     if (rb.sid != undefined) {
            var pvar = {name:rb.name,type:rb.stype,saf_no:rb.saf_no,size:rb.size,unit_description:rb.desp};
            db.query.updateDb('special_component', pvar, rb.sid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'special component modification', time: new Date(), refer_id: rb.pfid});
            });
          }
           else{ db.query.insertDb('special_component', {company:req.session.user.cur_company,name:rb.name,type:rb.stype,saf_no:rb.saf_no,size:rb.size,unit_description:rb.desp}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'special component creation', time: new Date(), refer_id: cid});
            });
            
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

module.exports = router;