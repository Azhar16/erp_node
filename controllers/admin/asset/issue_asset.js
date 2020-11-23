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
    res.render('tmpl/issue_asset/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getIssueAssetVen({company: req.session.user.cur_company, ttype: 'customer', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
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
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     
                    arrObj.data.push([data[0][i].id,data[0][i].issue_date,data[0][i].name, action]);
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.post('/autoasset', function (req, res) {
    var rb = req.body;
    console.log("yyy "+rb.term);
    var sql="SELECT a.id,a.asset_name,a.asset_no,ai.quantity FROM asset a INNER JOIN asset_item ai WHERE a.status='active' AND a.company=" + req.session.user.cur_company + "  AND a.status='active' AND  ( a.asset_name like '%" + rb.term + "%' OR a.asset_no like '%" + rb.term + "%') GROUP BY a.asset_no  LIMIT 20";
    console.log(sql);
    db.query.selectCustomDb(sql , function (row) {
        res.end(JSON.stringify(row));
    });
});

router.get('/assetbyid/:id', function (req, res) {
    db.query.selectDb('asset', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});

router.get('/autopartner/:v', function (req, res) {
    db.query.selectDb('customer', " company=" + req.session.user.cur_company + "  AND status='active' AND name like '%" + req.params.v + "%'", function (row) {
        res.end(JSON.stringify(row));
    });
});

router.get('/partnerbyid/:id', function (req, res) {
    db.query.selectDb('customer', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});

router.get('/new', function (req, res) {       
    res.render('tmpl/issue_asset/new.html');      
});

router.get('/edit/:id', function (req, res) {
    db.query.getIssueAssetEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        res.render('tmpl/issue_asset/edit.html',{row: row});
    });
});

router.get('/delete/:id', function (req, res) {
    db.query.selectDb('issue_asset', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('issue_asset', " id=" + req.params.id, function (cid) {
          db.query.deleteDb('issue_asset_item', " issue_asset=" + req.params.id, function (did) {
            generateLogFile({user: req.session.user.id, type: 'issued asset delete', time: new Date(), refer: sl});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        });
      });        
});

router.post('/save', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());
    var issue_date = moment(rb.issue_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
 if (typeof rb.did !== 'undefined') {
                db.query.updateDb('issue_asset', {partner:rb.partner,issue_date:issue_date,remark:rb.issue_remarks, modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.did, function (eid) {
                  db.query.deleteDb('issue_asset_item', " issue_asset=" + rb.did, function (cid) {});
                    insertSalesDetail(rb, rb.did, req);
                    generateLogFile({user: req.session.user.id, type: 'issue asset modification', time: new Date(), refer_id: rb.planid});
                    res.end(JSON.stringify({'code': rb.did, 'msg': 'Success'}));
                });
            }

else{
    db.query.insertDb('issue_asset', {company:req.session.user.cur_company,partner:rb.partner,issue_date:issue_date,remark:rb.issue_remarks, created_by: req.session.user.id}, function (pid) {
       insertSalesDetail(rb, pid, req);
       generateLogFile({user: req.session.user.id, type: 'issue asset  creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
  
});

function insertSalesDetail(rb, pid,req) {
    Object.keys(rb.item).forEach(function (k) {
        db.query.insertDb('issue_asset_item', {issue_asset: pid, asset: rb.item[k].id, quantity: rb.item[k].q}, function (sid) {});
    });
   
} 



module.exports = router;