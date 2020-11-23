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
        res.render('tmpl/special_service/list.html');
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
    db.query.getspecialserviceVen({company: req.session.user.cur_company,val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
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
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-si" title="sub service"> Sub Special Services </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].service_name , data[0][i].service_no, action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/new', function (req, res) {
        res.render('tmpl/special_service/new.html');
});
router.get('/edit/:id', function (req, res) {
     db.query.selectDb('special_service', " id=" + req.params.id , function (row) {
        res.render('tmpl/special_service/edit.html', {row: row[0]});
                        });      
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('special_service', " id=" + req.params.id, function (sl) {
      db.query.deleteDb('special_service', "id="+req.params.id, function (cid) { 
        db.query.deleteDb('sub_special_service', "special_service=" + req.params.id, function (sid) {});
        generateLogFile({user: req.session.user.id, type: 'special service delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});
router.get('/subservice/:id', function (req, res) {
        res.render('tmpl/special_service/sub_list.html',{ssid:req.params.id});      
});

router.post('/ajaxsubget/:id', function (req, res) {
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
    db.query.getSubServiceVen({special_service: req.params.id, val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
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
                
                    
                    arrObj.data.push([data[0][i].name , data[0][i].no, action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/subnew/:id', function (req, res) {
        res.render('tmpl/special_service/sub_new.html',{ssid:req.params.id});
});
router.get('/subedit/:id', function (req, res) {
     db.query.selectDb('sub_special_service', " id=" + req.params.id , function (row) {
        res.render('tmpl/special_service/sub_edit.html', {row: row[0]});
                        });      
});
router.get('/subdelete/:id', function (req, res) {
    db.query.selectDb('sub_special_service', " id=" + req.params.id, function (sl) {
      db.query.deleteDb('sub_special_service', "id="+req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'sub service delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});
router.post('/save', function (req, res) {
    var rb = req.body;
     if (rb.ssid != undefined) {
            var pvar = {service_name:rb.special_service,service_no:rb.special_service_no,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('special_service', pvar, rb.ssid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'special service modification', time: new Date(), refer_id: rb.ssid});
               //res.end(JSON.stringify({'code': '0', 'msg': 'Success'}));
            });
        }
           else{ db.query.insertDb('special_service', {service_name:rb.special_service,service_no:rb.special_service_no,company: req.session.user.cur_company,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'special service creation', time: new Date(), refer_id: cid});
            });
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});
router.post('/subsave', function (req, res) {
    var rb = req.body;
     if (rb.sssid != undefined) {
            var pvar = {name:rb.sub_special_service,no:rb.sub_special_service_no};
            db.query.updateDb('sub_special_service', pvar, rb.sssid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'product Item specification modification', time: new Date(), refer_id: rb.sssid});
               //res.end(JSON.stringify({'code': '0', 'msg': 'Success'}));
            });
        }
           else{ db.query.insertDb('sub_special_service', {name:rb.sub_special_service,no:rb.sub_special_service_no,special_service:rb.ssid}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'product Item specification creation', time: new Date(), refer_id: cid});
            });
         }
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});





module.exports = router;