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
    res.render('tmpl/asset/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getAssetVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                if (data[0][i].status == 'delete') {
                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="monthlyplan_sheet"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                     var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-dv" title="Doc_view"> Doc View </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                } else if (data[0][i].status == 'active'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-dv" title="Doc_view"> Doc View </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                       // action = '</button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     }
                    arrObj.data.push([data[0][i].asset_name,data[0][i].asset_no, pstatus, action]);
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});

router.get('/new', function (req, res) {
    var fyear = getFYear(new Date());
          db.query.selectDb('assettype', " status<>'delete'", function (atype) {
        db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
         db.query.selectCustomDb("SELECT MAX(autono) no FROM asset WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var assetnono = (set[0].asset_pre == 'AI') ? no : ((set[0].asset_pre == 'FYEAR') ? fyear : set[0].asset_pre);
                    assetnono += (set[0].asset_pre != '') ? set[0].asset_div : '';
                    assetnono += (set[0].asset_cen == 'AI') ? no : ((set[0].asset_cen == 'FYEAR') ? fyear : set[0].asset_cen);
                    assetnono += (set[0].asset_cen != '') ? set[0].asset_div : '';
                    assetnono += (set[0].asset_su == 'AI') ? no : ((set[0].asset_su == 'FYEAR') ? fyear : set[0].asset_su);
                    //console.log('planno '+planno);
                    res.render('tmpl/asset/new.html',{assetnono:assetnono,atype:atype});
          });
        });
    });     
});

router.get('/edit/:id', function (req, res) {
    console.log(req.params.id);
    db.query.selectDb('assettype', " status<>'delete'", function (atype) {
   db.query.getAssetEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        res.render('tmpl/asset/edit.html',{row: row,atype:atype});
    });
});
});

router.get('/delete/:id', function (req, res) {
    db.query.selectDb('asset', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('asset', " id=" + req.params.id, function (cid) {
            generateLogFile({user: req.session.user.id, type: 'asset delete', time: new Date(), refer: sl});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        });        
});

router.post('/save', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());
    db.query.selectCustomDb("SELECT MAX(autono) no FROM asset WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            var no = (maxno[0].no + 1).toString().padStart(5, '0');
 if (typeof rb.assetid !== 'undefined') {
                db.query.updateDb('asset', {fyear:fyear,asset_type:rb.asset_type,asset_name:rb.asset_name,buying_price:rb.buying_price, modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.assetid, function (eid) {
                    generateLogFile({user: req.session.user.id, type: 'asset modification', time: new Date(), refer_id: rb.planid});
                    res.end(JSON.stringify({'code': rb.assetid, 'msg': 'Success'}));
                });
            }

else{
    db.query.insertDb('asset', {fyear:fyear,autono:no,company:req.session.user.cur_company,asset_no:rb.asset_no,asset_type:rb.asset_type,asset_name:rb.asset_name,buying_price:rb.buying_price, created_by: req.session.user.id}, function (pid) {
       generateLogFile({user: req.session.user.id, type: 'asset creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
  });
});

router.get('/docview/:id', function (req, res) {
    db.query.selectDb('document', "doc_type='asset' AND ref_id=" + req.params.id, function (row) {
        res.render('tmpl/asset/asset_doc.html', {row: row[0],sid:req.params.id});
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
    form.uploadDir = config.get('asset_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {

        var docname = '';

          if (typeof (files.asset_doc) != 'undefined' ){
              docname = ctime + files.asset_doc.name;
           }
        if (fields.imgid !== 'undefined') {
            if (docname === '')
                docname = fields.oasset_doc;
            var pvar = {doc:docname};
            
            db.query.updateDb('document', pvar, fields.imgid, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'Asset document modification', time: new Date(), refer_id: fields.imgid});
          });
        }
        else{  
         console.log("insert");  
            db.query.insertDb('document', {doc:docname,ref_id:fields.assetid,doc_type:'asset'}, function (did) {
            generateLogFile({user: req.session.user.id, type: 'Asset document creation', time: new Date(), refer_id: did});
            });
            }
             res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
     });

});




module.exports = router;