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
    res.render('tmpl/asset_type/list.html');
  
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getAssettypeVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                 
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                    
                    arrObj.data.push([data[0][i].name,data[0][i].type,action]);
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
  res.render('tmpl/asset_type/new.html');
     
});
router.get('/edit/:id', function (req, res) {
    db.query.selectDb('assettype', " id=" + req.params.id, function (row) {
        res.render('tmpl/asset_type/edit.html',{row: row[0]});
    });
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('assettype', " id=" + req.params.id, function (sl) {
        db.query.updateDb('assettype',{status:'delete'},  req.params.id, function (cid) {
            generateLogFile({user: req.session.user.id, type: 'assettype delete', time: new Date(), refer: sl});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        });        
});
router.post('/save', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());
 if (typeof rb.atid !== 'undefined') {
                db.query.updateDb('assettype', {name:rb.tname,type:rb.category_type,incometax:rb.aincometax,companyact:rb.acompanyact,description:rb.adescription,useful_life:rb.useful_life}, rb.atid, function (eid) {
                    generateLogFile({user: req.session.user.id, type: 'plan modification', time: new Date(), refer_id: rb.planid});
                    res.end(JSON.stringify({'code': rb.atid, 'msg': 'Success'}));
                });
            }
else{
    db.query.insertDb('assettype', {company:req.session.user.cur_company,year:fyear,name:rb.tname,type:rb.category_type,incometax:rb.aincometax,companyact:rb.acompanyact,description:rb.adescription,useful_life:rb.useful_life}, function (pid) {
       generateLogFile({user: req.session.user.id, type: 'plan creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
});
 }
});
module.exports = router;