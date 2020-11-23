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
    res.render('tmpl/purchase_order/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getPurchaseOrderVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                 var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                       pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    
                      var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-v" title="edit"> View </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                                            
                     //var action = '<button data-id="' + data[0][i].rawitem + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 p-l-v custom-modal-button" title="View" > <i class="fa fa-eye"></i> </button>';
                      arrObj.data.push([data[0][i].po_no,data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>',data[0][i].enquiry,data[0][i].date,data[0][i].total_amount,action ]);
                                                         
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
  var fyear = getFYear(new Date());
  db.query.selectCustomDb("SELECT * from  customer  WHERE status<>'delete' AND tag='vendor'", function (cus) {
    db.query.selectCustomDb("SELECT * from  purchase_enquiry  WHERE status<>'delete' AND enquiry_status='pending'", function (enqy) {
       db.query.selectDb('offer_term_conditions_fields', " company=" + req.session.user.cur_company, function (otc) {
             // db.query.getPurchaseOrderDetails({id: req.params.id, company: req.session.user.cur_company}, function (row) {
      res.render('tmpl/purchase_order/new.html', {payment_terms: config.get('payment_terms'),comstate: req.session.company.state,tax_slab: config.get('tax_slab'),user:req.session.user.name,enqy:enqy,cus:cus,otc:otc});    
         //});
       });
     });
   });
 });
router.get('/autonum/:v', function (req, res) {
    var fyear = getFYear(new Date());
    var otype=req.params.v;
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
       db.query.selectCustomDb("SELECT MAX(autono) no FROM purchase_order WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
       var no = (maxno[0].no + 1).toString().padStart(5, '0');
       var pono = (set[0].porder_pre == 'AI') ? no : ((set[0].porder_pre == 'FYEAR') ? fyear : set[0].porder_pre);
       //pono += (set[0].porder_pre != '') ? set[0].porder_div : '';
       pono += otype;
       pono += (otype != '') ? set[0].porder_div : '';
       pono += (set[0].porder_cen == 'AI') ? no : ((set[0].porder_cen == 'FYEAR') ? fyear : set[0].porder_cen);
       pono += (set[0].porder_cen != '') ? set[0].porder_div : '';
       pono += (set[0].porder_su == 'AI') ? no : ((set[0].porder_su == 'FYEAR') ? fyear : set[0].porder_su);
        res.end(JSON.stringify(pono));
    });
  });
});
router.post('/getalldetail', function (req, res) {
  var rb = req.body;
    db.query.getPoDetails({id: rb.enquiry_no,vendor:rb.vendor, company: req.session.user.cur_company}, function (row) {
        res.end(JSON.stringify(row));
    });
});
router.post('/getvendordetail', function (req, res) {
  var rb = req.body;
    db.query.getCusDetails({vendor:rb.vendor, company: req.session.user.cur_company}, function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/edit/:id', function (req, res) {
  db.query.selectCustomDb("SELECT * from  customer  WHERE status<>'delete' AND tag='vendor'", function (cus) {
    db.query.selectCustomDb("SELECT * from  purchase_enquiry  WHERE status<>'delete'", function (enqy) {  
      db.query.getPurchaseOrderEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        console.log(row);
        res.render('tmpl/purchase_order/edit.html',{payment_terms: config.get('payment_terms'),row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),enqy:enqy,cus:cus});
      });
    });
  });
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('purchase_order', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('purchase_order', " id=" + req.params.id, function (cid) {
          db.query.updateDb('purchase_enquiry', {enquiry_status:'pending',modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, sl[0].purchase_enquiry, function (pid) {});
            db.query.deleteDb('purchase_order_item', " purchase_order=" + req.params.id, function (cid) {
                db.query.deleteDb('purchase_order_additional', " purchase_order=" + req.params.id, function (cid) {
                            generateLogFile({user: req.session.user.id, type: 'purchase order delete', time: new Date(), refer: sl});
                            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                });
            });
        });
    });
});
router.get('/view/:id', function (req, res) {
    db.query.selectDb('purchase_order', " id=" + req.params.id, function (porder) {
        res.render('tmpl/purchase_order/bill.html', {sid: req.params.id, porder: porder[0]});
   });
});
router.get('/purchaseview/:id', function (req, res) {
    db.query.getPurchaseOrderEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
      db.query.selectDb('bank', " id=" + req.session.company.default_bank, function (bank) {
        res.render('tmpl/purchase_order/billbody.html', {com: req.session.company, row: row,bank: bank});
    });
  });   
});
router.post('/save', function (req, res) {
    var rb = req.body;
    var dt = rb.po_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.po_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var deliverydate = moment(rb.delivery_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectCustomDb("SELECT MAX(autono) no FROM purchase_order WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
      var no = (maxno[0].no + 1).toString().padStart(5, '0');
    var enquiry='';
    var enquiryid='';
    console.log("opo "+rb.enquiry_no);
    if(rb.enquiry_no != ''){
      enquiry = 'accepted';
      enquiryid = rb.enquiry_no;
    }
    else{
      if(rb.old_enquiry != undefined){
      enquiry = 'pending';
      enquiryid = rb.old_enquiry;
    }
    }
    if (rb.sid != undefined) {
        db.query.updateDb('purchase_order', {vendor: rb.vendor,price_competitive:rb.pcid,purchase_enquiry:rb.enquiry_no,po_date: bdate,delivery_date:deliverydate,quotation_no:rb.quotation_no,total_amount: rb.total_amount,note:rb.note,modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
           db.query.updateDb('purchase_enquiry', {enquiry_status:enquiry,modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, enquiryid, function (pid) {});
            db.query.deleteDb('purchase_order_item', " purchase_order=" + rb.sid, function (cid) {});
            db.query.deleteDb('purchase_order_additional', " purchase_order=" + rb.sid, function (cid) {});
            insertPurchaseOrderDetail(rb,rb.sid,req);
            generateLogFile({user: req.session.user.id, type: 'purchase order modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': rb.sid, 'msg': 'Success'}));
        });
    } else { 
        db.query.insertDb('purchase_order', {company: req.session.user.cur_company,price_competitive:rb.pcid,purchase_enquiry:rb.enquiry_no,autono:no, fyear: fyear,po_no:rb.purchase_order_no,vendor: rb.vendor,po_date: bdate,delivery_date:deliverydate,quotation_no:rb.quotation_no,total_amount: rb.total_amount,note:rb.note,created_by: req.session.user.id}, function (pid) {
        if(rb.enquiry_no != ''){
        db.query.updateDb('purchase_enquiry', {enquiry_status:'accepted',modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.enquiry_no, function (pid) {});
            }
            insertPurchaseOrderDetail(rb,pid,req);
            generateLogFile({user: req.session.user.id, type: 'purchase order creation', time: new Date(), refer_id: pid});
            res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
      });       
    }
  });
});
function insertPurchaseOrderDetail(rb, pid, req) {
    Object.keys(rb.item).forEach(function (k) {
        db.query.insertDb('purchase_order_item', {purchase_order: pid, item: rb.item[k].id, quantity: rb.item[k].q, unit: rb.item[k].u, rate: rb.item[k].p,  final_amount: rb.item[k].t,tax:rb.item[k].ts,tax_amount:rb.item[k].tx}, function (sid) {});
    });
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('purchase_order_additional', {purchase_order: pid, purchase_order_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
    });
     Object.keys(rb.otc).forEach(function (k) {
     db.query.insertDb('po_term_conditions', {purchase_order: pid, po_term_conditions_fields: rb.otc[k].id, message: rb.otc[k].msg}, function (sid) {});
    });
} 
module.exports = router;