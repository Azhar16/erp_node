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
    res.render('tmpl/asset_sale/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
                };
    db.query.getAssetSaleVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-pid="' + data[0][i].saiid+ '"  class="dropdown-item s-l-dv" title="Doc_view"> Doc View </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-pid="' + data[0][i].saiid+ '"  class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-pid="' + data[0][i].saiid+ '"  class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     
                    arrObj.data.push([data[0][i].saiid,data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>',data[0][i].asset_name,data[0][i].rate,data[0][i].asset_date, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.post('/autoasset', function (req, res) {
    var rb = req.body;
    console.log("yyy "+rb.term);
    var sql="SELECT ai.*,a.id as aid,a.asset_no,a.asset_name FROM asset_item ai INNER JOIN asset a ON ai.asset = a.id WHERE a.company=" + req.session.user.cur_company + " AND ai.sale ='no' AND  ( a.asset_name like '%" + rb.term + "%' OR a.asset_no like '%" + rb.term + "%')  LIMIT 20";
    db.query.selectCustomDb(sql , function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/assetbyid/:id', function (req, res) {
    db.query.selectCustomDb("SELECT ai.*,a.id as aid FROM asset_item ai INNER JOIN asset a ON ai.asset = a.id WHERE ai.id='"+req.params.id+"'" , function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/new', function (req, res) {  
  db.query.selectDb('asset_location', " status='active'", function (loc) {     
    res.render('tmpl/asset_sale/new.html',{payment_terms: config.get('payment_terms'),loc:loc});      
  });
});
router.get('/edit/:id', function (req, res) {
  db.query.selectDb('asset_location', " status='active'", function (lock) {
    db.query.getSaleAssetEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {        
        res.render('tmpl/asset_sale/edit.html',{row: row,payment_terms: config.get('payment_terms'),lock:lock});
      });
   });
});
router.get('/delete', function (req, res) {
  var pid = req.query.pid;
  var siid = pid.replace(/"/g,"");
  var cid = req.query.cid;
  var sid = cid.replace(/"/g,"");

    db.query.selectDb('sale_asset', " id=" + sid, function (sl) {
        db.query.deleteDb('sale_asset', " id=" + sid, function (cid) {
           db.query.deleteDb('sale_asset_item', " sale_asset=" + sid, function (did) {
              db.query.updateDbCustom('asset_item', {sale:'no',sale_asset_item:0}, "sale_asset_item='"+ siid +"'", function (cid) {});
              generateLogFile({user: req.session.user.id, type: 'asset sale info delete', time: new Date(), refer: sid});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
          });
       });
    });        
});
router.get('/itemdelete/:id', function (req, res) {
  db.query.deleteDb('sale_asset_item', " id=" + req.params.id, function (did) {
    db.query.updateDbCustom('asset_item', {sale:'no',sale_asset_item:0}, "sale_asset_item='"+ req.params.id +"'", function (cid) {});
     generateLogFile({user: req.session.user.id, type: 'asset delete', time: new Date(), refer: sl});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
   });
});
router.post('/save', function (req, res) {
  var form = new formidable.IncomingForm();
    var rb = req.body;
    //var fyear = getFYear(new Date());
    var ctime = new Date().getTime();
    form.uploadDir = config.get('asset_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
form.parse(req, function (err, fields, files) {
  var sale_date = moment(fields.sale_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
  var fyear = getFYear(new Date(fields.sale_date));
  var itm = JSON.parse(fields.itm);
        var docname = '';
          if (typeof (files.asset_doc) != 'undefined' ){
              docname = ctime + files.asset_doc.name;
           }
           console.log("did "+fields.did);
        if (fields.did !== 'undefined') {
            if (docname === '')
                docname = fields.oasset_doc;

                db.query.updateDb('sale_asset', {fyear:fyear,customer:fields.customer,location:fields.acure_location,date:sale_date,final_amount:fields.tot,note:fields.asset_note,asset_doc:docname,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, fields.did, function (eid) {
                insertsaleitemDetail(itm, fields.did, req);
                generateLogFile({user: req.session.user.id, type: 'Sale Asset Info modification', time: new Date(), refer_id: fields.did});
                res.end(JSON.stringify({'code': fields.did, 'msg': 'Success'}));
          });
        }
        else{  
            db.query.insertDb('sale_asset', {fyear:fyear,company:req.session.user.cur_company,customer:fields.customer,location:fields.acure_location,date:sale_date,final_amount:fields.tot,note:fields.asset_note,asset_doc:docname, created_by: req.session.user.id}, function (pid) {
            insertsaleitemDetail(itm, pid, req);
            generateLogFile({user: req.session.user.id, type: 'Sale Asset Info creation', time: new Date(), refer_id: pid});
            res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
            });
            }
      });
});
router.get('/docview/:id', function (req, res) {
    db.query.selectDb('sale_asset', "id=" + req.params.id, function (row) {
        res.render('tmpl/asset_sale/docview.html', {row: row[0],sid:req.params.id});
    });
});
router.get('/docdelete/:id', function (req, res) {
    db.query.updateDb('sale_asset',{asset_doc:''}, req.params.id, function (cid) {
       generateLogFile({user: req.session.user.id, type: 'Document delete', time: new Date(), refer: cid});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
         });
});
function insertsaleitemDetail(itm, pid,req) {
    Object.keys(itm).forEach(function (k) {
        if(itm[k].itmid != 0){
        db.query.updateDb('sale_asset_item', {sale_asset: pid,asset_item: itm[k].id,asset:itm[k].assetid,quantity: itm[k].q,rate: itm[k].p,final_amount: itm[k].t},itm[k].itmid,function (sid) {});
      }
      else{
        db.query.insertDb('sale_asset_item', {sale_asset: pid,asset_item: itm[k].id,asset:itm[k].assetid,quantity: itm[k].q,rate: itm[k].p,final_amount: itm[k].t}, function (tid) {
          db.query.updateDb('asset_item', {sale:'yes',sale_asset_item:tid},itm[k].id,function (sid) {});
       });
      }
    });
}
router.post('/savedocument', function (req, res) {
    var form = new formidable.IncomingForm();
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
            if (docname === '')
                docname = fields.oasset_doc;
            var pvar = {asset_doc:docname};
            db.query.updateDb('sale_asset', pvar, fields.assetid, function (uid) {
              generateLogFile({user: req.session.user.id, type: 'Asset sale document modification', time: new Date(), refer_id: fields.assetid});
               res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
          });
     });
});
module.exports = router;