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
        res.render('tmpl/product_specification/list.html');
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
    db.query.getprodspecificationVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                    //var action = action = '<button data-id="' + data[0][i].id + '"  class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc " title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v " title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> <i class="fa fa-wrench"></i></button>';
                  /* var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-specification_item" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-si " title="status_change"> Item Specification </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> Edit</button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-si" title="specific_item"> Sub Specification </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].specification_name , data[0][i].specification_no, action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/new', function (req, res) {
        res.render('tmpl/product_specification/new.html');
});
router.get('/edit/:id', function (req, res) {
     db.query.selectDb('prod_specification_category', "status<>'delete' AND id=" + req.params.id , function (row) {
        res.render('tmpl/product_specification/edit.html', {row: row[0]});
                        });      
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('prod_specification_category', "status<>'delete' AND id=" + req.params.id, function (sl) {
      db.query.updateDb('prod_specification_category', {status: 'delete', modified_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'product specification delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});
router.get('/specification_item/:id', function (req, res) {
        res.render('tmpl/product_specification/specification_item_list.html',{psid:req.params.id});      
});

router.post('/ajaxspeficitemget/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
            console.log("iid "+req.params.id);
           // jsonfile.readFile('settings/'+req.session.user.id+'.json', function (err, usavedrole) {
               // req.session.userrole = usavedrole;
    db.query.getproditemspecificationVen({specification_id: req.params.id, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                    //var action = action = '<button data-id="' + data[0][i].id + '"  class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc " title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v " title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> <i class="fa fa-wrench"></i></button>';
                   /*var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-ie " title="Edit"> Edit</button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-id " title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-ie" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-id" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].name , data[0][i].code,data[0][i].short_code, action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/specificitemnew/:id', function (req, res) {
        res.render('tmpl/product_specification/specification_item_new.html',{psid:req.params.id});
});
router.get('/specificitemedit/:id', function (req, res) {
     db.query.selectDb('prod_specification_item', "status<>'delete' AND id=" + req.params.id , function (row) {
        res.render('tmpl/product_specification/specification_item_edit.html', {row: row[0]});
                        });      
});
router.get('/specificitemdelete/:id', function (req, res) {
    db.query.selectDb('prod_specification_item', "status<>'delete' AND id=" + req.params.id, function (sl) {
      db.query.updateDb('prod_specification_item', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'product Item specification delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});
router.post('/save', function (req, res) {
    var rb = req.body;
    //console.log("name "+rb.component_name);
    console.log("psid "+rb.psid);
     if (rb.psid != undefined) {
            var pvar = {specification_name:rb.specification_name,specification_no:rb.specification_no,modified_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('prod_specification_category', pvar, rb.psid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'product specification modification', time: new Date(), refer_id: rb.psid});
               //res.end(JSON.stringify({'code': '0', 'msg': 'Success'}));
            });
        }
           else{ db.query.insertDb('prod_specification_category', {specification_name:rb.specification_name,specification_no:rb.specification_no,company: req.session.user.cur_company,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'product specification creation', time: new Date(), refer_id: cid});
            });
            
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.post('/specificitemsave', function (req, res) {
    var rb = req.body;
    //console.log("name "+rb.component_name);
    console.log("psid "+rb.pisid);
     if (rb.pisid != undefined) {
            var pvar = {name:rb.specification_item_name,code:rb.specification_item_code,short_code: rb.specification_item_short_code,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('prod_specification_item', pvar, rb.pisid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'product Item specification modification', time: new Date(), refer_id: rb.pisid});
               //res.end(JSON.stringify({'code': '0', 'msg': 'Success'}));
            });
        }
           else{ db.query.insertDb('prod_specification_item', {specification_id:rb.psid,name:rb.specification_item_name,code:rb.specification_item_code,short_code: rb.specification_item_short_code,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'product Item specification creation', time: new Date(), refer_id: cid});
            });
            
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});





module.exports = router;