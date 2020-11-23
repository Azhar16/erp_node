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
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-si" title="specific_item"> Sub Feature </a>'
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
  db.query.selectDb('component_category_name', "status<>'delete' ", function (comp) {
        res.render('tmpl/product_feature/new.html',{comp:comp});
      });
});
router.get('/edit/:id', function (req, res) {
   db.query.selectDb('component_category_name', "status<>'delete' ", function (comp) {
     db.query.selectDb('product_feature', "status<>'delete' AND id=" + req.params.id , function (row) {
        res.render('tmpl/product_feature/edit.html', {row: row[0],comp:comp});
      });      
   });
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('product_feature', "status<>'delete' AND id=" + req.params.id, function (sl) {
      db.query.updateDb('product_feature', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
      db.query.updateDbCustom('product_sub_feature', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, "prod_feature=" + req.params.id, function (sid) {});  
        generateLogFile({user: req.session.user.id, type: 'product specification delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});
router.get('/subfeature/:id', function (req, res) {
        res.render('tmpl/product_feature/sub_list.html',{psid:req.params.id});      
});
router.post('/ajaxsubfeatureget/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };

    db.query.getsubfeatureVen({subfeatureid: req.params.id, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-ie" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-id" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].name , action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});

router.get('/subfeaturenew/:id', function (req, res) {
    db.query.selectDb('forging', " status<>'delete' ", function (forg) {
    db.query.selectDb('prod_unit', " status<>'delete' ", function (punit) {   
        res.render('tmpl/product_feature/sub_new.html',{psid:req.params.id,punit:punit,forg:forg});
   });
  });
});
router.get('/subfeatureedit/:id', function (req, res) {
  db.query.selectDb('forging', " status<>'delete' ", function (forg) {
  db.query.selectDb('prod_unit', " status<>'delete' ", function (punit) {
     db.query.selectDb('product_sub_feature', "status<>'delete' AND id=" + req.params.id , function (row) {
        res.render('tmpl/product_feature/sub_edit.html', {row: row[0],punit:punit,forg:forg});
    });
   });
  });      
});
router.get('/subfeaturedelete/:id', function (req, res) {
    db.query.selectDb('product_sub_feature', "status<>'delete' AND id=" + req.params.id, function (sl) {
      db.query.updateDb('product_sub_feature', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'product Sub Feature delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});

router.post('/save', function (req, res) {
    var rb = req.body;
    console.log("psid "+rb.pfid);
     if (rb.pfid != undefined) {
            var pvar = {name:rb.prod_feature_name,component_category_name:rb.component_category,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('product_feature', pvar, rb.pfid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'product Feature modification', time: new Date(), refer_id: rb.pfid});
            });
        }
           else{ db.query.insertDb('product_feature', {name:rb.prod_feature_name,component_category_name:rb.component_category,company: req.session.user.cur_company,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'product Feature creation', time: new Date(), refer_id: cid});
            });
            
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});
router.post('/subfeaturesave', function (req, res) {
    var rb = req.body;
     if (rb.pisid != undefined) {
            var pvar = {name:rb.prod_sub_feature_name,type:rb.type,length:rb.length,diameter:rb.diameter,unit:rb.unit,forging:rb.forging,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('product_sub_feature', pvar, rb.pisid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'product Sub Feature modification', time: new Date(), refer_id: rb.pisid});
            });
        }
           else{ db.query.insertDb('product_sub_feature', {prod_feature:rb.psid,name:rb.prod_sub_feature_name,type:rb.type,length:rb.length,diameter:rb.diameter,unit:rb.unit,forging:rb.forging,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'product Sub Feature creation', time: new Date(), refer_id: cid});
            });
            
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});



module.exports = router;