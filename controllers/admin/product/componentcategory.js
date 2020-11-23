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
    res.render('tmpl/component_category/list.html');
});

router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getcomponentcategoryVen({company:req.session.user.cur_company,status:'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-dv" title="component_view"> View Document  </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-sc" title="sub_category"> Sub Category  </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-m" title="material"> Material </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit_code"> Edit  </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                    arrObj.data.push([data[0][i].component_name ,data[0][i].product_type, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
  });
});

router.get('/new', function (req, res) {
        res.render('tmpl/component_category/new.html');
    });

router.post('/save', function (req, res) {
    var rb = req.body;
    console.log("name "+rb.component_name);
    console.log("cid "+rb.cid);
     if (rb.cid != undefined) {
            var pvar = {component_name:rb.component_name,product_type:rb.component_category,drawing_no:rb.drawing_no,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('component_category_name', pvar, rb.cid, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'componemt name  modification', time: new Date(), refer_id: rb.cid});
               res.end(JSON.stringify({'code': rb.cid, 'msg': 'Success'}));
            });
        }
           else{ 
             db.query.insertDb('component_category_name', {component_name:rb.component_name,product_type:rb.component_category,drawing_no:rb.drawing_no,company: req.session.user.cur_company,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'componemt name creation', time: new Date(), refer_id: cid});
                
                res.end(JSON.stringify({'code': cid, 'msg': 'Success'}));
            });
            
         }
         
});

router.get('/edit/:id', function (req, res) {
     db.query.selectDb('component_category_name', " id=" + req.params.id , function (row) {
      db.query.selectDb('document', "doc_type = 'component' AND ref_id=" + req.params.id , function (img) {     
        res.render('tmpl/component_category/edit.html', {row: row[0],img:img[0]});
     });
   });      
});

router.get('/delete/:id', function (req, res) {
        db.query.selectDb('component_category_name', " company=" + req.session.user.cur_company, function (row) {
             db.query.updateDb('component_category_name', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'component name delete', time: new Date(), refer_id: req.params.id});
        res.render('tmpl/component_category/list.html',{row:row});
     });
    });
});
router.get('/csubname/:id', function (req, res) {
    console.log("csid "+req.params.id);
        res.render('tmpl/component_category/sub_list.html',{csid:req.params.id});      
});
router.post('/ajaxsubnameget/:id', function (req, res) {
    console.log("csid1 "+req.params.id);
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getsubcomponentcategoryVen({component_category_name: req.params.id, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {

                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-sce" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-scd" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].component_name , data[0][i].component_subname,action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/subnew/:cid', function (req, res) {
    console.log("cid23 "+req.params.cid);
        res.render('tmpl/component_category/sub_new.html',{cid:req.params.cid});
    });

router.get('/subedit/:id', function (req, res) {
     db.query.selectDb('component_category_subname', " id=" + req.params.id, function (cs) {
                res.render('tmpl/component_category/sub_edit.html', {cs: cs[0]});
            });
     
});



router.get('/subdelete/:id', function (req, res) {
    console.log("iif "+req.params.id);
     db.query.selectDb('component_category_subname', " id=" + req.params.id, function (cs) {
                    db.query.updateDb('component_category_subname', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'component Sub name delete', time: new Date(), refer_id: req.params.id});
               res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
          });
});
router.get('/material/:id', function (req, res) {
  db.query.selectDb('component_category_name', " id=" + req.params.id, function (psid) {
        res.render('tmpl/component_category/material_list.html',{psid:psid[0]});   
    });   
});
router.post('/ajaxmaterialget/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };

    db.query.getmaterialVen({componentid: req.params.id,val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-me" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-md" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].name,data[0][i].code,data[0][i].short_code,data[0][i].showing, action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});
router.get('/materialnew/:id', function (req, res) { 
  res.render('tmpl/component_category/material_new.html',{psid:req.params.id});
});
router.get('/materialedit/:id', function (req, res) {
 db.query.selectDb('material_master', "id=" + req.params.id , function (row) {
    res.render('tmpl/component_category/material_edit.html', {row: row[0]});
  });      
});
router.get('/materialdelete/:id', function (req, res) {
    db.query.selectDb('material_master', "id=" + req.params.id, function (sl) {
      db.query.deleteDb('material_master',"id='"+req.params.id+"'", function (cid) { 
        generateLogFile({user: req.session.user.id, type: 'Material delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });         
  });
});

router.post('/subsave', function (req, res) {
    var rb = req.body;
    console.log("name "+rb.component_subname);
    console.log("cid "+rb.cid);
     if (rb.sid != undefined) {
            var pvar = {component_subname:rb.component_subname,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('component_category_subname', pvar, rb.sid, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'componemt sub name  modification', time: new Date(), refer_id: rb.cid});
               res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        }
           else{ db.query.insertDb('component_category_subname', {component_subname:rb.component_subname,company: req.session.user.cur_company,component_category_name:rb.cid,created_by:req.session.user.id}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'componemt subname creation', time: new Date(), refer_id: cid});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
            
         }
});

router.get('/docview/:id', function (req, res) {
    db.query.selectDb('document', "doc_type='component' AND ref_id=" + req.params.id, function (row) {
        res.render('tmpl/component_category/componentdoc.html', {row: row[0],sid:req.params.id});
                });

});
router.get('/docdelete/:id', function (req, res) {
    db.query.deleteDb('document', "id=" + req.params.id, function (cid) {
       generateLogFile({user: req.session.user.id, type: 'Document delete', time: new Date(), refer: cid});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
         });
     
});
router.post('/savedocument', function (req, res) {
    var form = new formidable.IncomingForm();
    var rb = req.body;
    var ctime = new Date().getTime();
    form.uploadDir = config.get('component_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        

        var docname = '';

          if (typeof (files.component_doc) != 'undefined' ){
              docname = ctime + files.component_doc.name;
           }
        if (fields.imgid !== 'undefined') {
            if (docname === '')
                docname = fields.ocomponent_doc;
            var pvar = {doc:docname};
            
            db.query.updateDb('document', pvar, fields.imgid, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'Component document modification', time: new Date(), refer_id: fields.imgid});
          });
        }
        
        else{  
            db.query.insertDb('document', {doc:docname,ref_id:fields.componentid,doc_type:'component'}, function (did) {
            generateLogFile({user: req.session.user.id, type: 'Component document creation', time: new Date(), refer_id: did});
            });
            }
             res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
     });

});
router.post('/materialsave', function (req, res) {
    var rb = req.body;
     if (rb.pisid != undefined) {
            var pvar = {name:rb.material_name,code:rb.material_code,short_code:rb.material_short_code,showing:rb.material_showing_status};
            db.query.updateDb('material_master', pvar, rb.pisid, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'material modification', time: new Date(), refer_id: rb.pisid});
            });
          }
           else{ db.query.insertDb('material_master', {component_category_name:rb.psid,company: req.session.user.cur_company,name:rb.material_name,code:rb.material_code,short_code:rb.material_short_code,showing:rb.material_showing_status}, function (cid) {
                generateLogFile({user: req.session.user.id, type: 'material creation', time: new Date(), refer_id: cid});
            });
            
          }
          
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});



module.exports = router;