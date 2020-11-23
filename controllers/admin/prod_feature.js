var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');

router.get('/', function (req, res) {
    //db.query.getSalesVen({company: req.session.user.cur_company, status: 'active'}, function (row) {
        res.render('tmpl/product_feature/list.html');
   // });
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
           // jsonfile.readFile('settings/'+req.session.user.id+'.json', function (err, usavedrole) {
               // req.session.userrole = usavedrole;
    db.query.getprodfeatureVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                    //var action = action = '<button data-id="' + data[0][i].id + '"  class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc " title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v " title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> <i class="fa fa-wrench"></i></button>';
                   /*var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> Edit</button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].name , action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/new', function (req, res) {
        res.render('tmpl/product_feature/new.html');
});
router.get('/edit/:id', function (req, res) {
     db.query.selectDb('product_feature', "status<>'delete' AND id=" + req.params.id , function (row) {
        res.render('tmpl/product_feature/edit.html', {row: row[0]});
                        });      
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('product_feature', "status<>'delete' AND id=" + req.params.id, function (sl) {
      db.query.updateDb('product_feature', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'product specification delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});


router.post('/save', function (req, res) {
    var rb = req.body;
    //console.log("name "+rb.component_name);
    console.log("psid "+rb.pfid);
     if (rb.pfid != undefined) {
            var pvar = {name:rb.prod_feature_name,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('product_feature', pvar, rb.pfid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'product Feature modification', time: new Date(), refer_id: rb.pfid});
               //res.end(JSON.stringify({'code': '0', 'msg': 'Success'}));
            });
        }
           else{ db.query.insertDb('product_feature', {name:rb.prod_feature_name,company: req.session.user.cur_company,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'product Feature creation', time: new Date(), refer_id: cid});
            });
            
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});



module.exports = router;