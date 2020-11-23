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
    res.render('tmpl/price_competitive/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getPriceCompetitiveVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                 var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                       pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    
                      var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-pon" title="purchase_order"> Purchase Order </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                                            
                     //var action = '<button data-id="' + data[0][i].rawitem + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 p-l-v custom-modal-button" title="View" > <i class="fa fa-eye"></i> </button>';
                      arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>',data[0][i].enquiry,data[0][i].date,data[0][i].total_amount,action ]);  
            } 
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
    db.query.selectCustomDb("SELECT * from  customer  WHERE status<>'delete' AND tag='vendor'", function (cus) {
        db.query.selectCustomDb("SELECT * from  purchase_enquiry  WHERE status<>'delete'", function (enqy) {  
            db.query.selectDb('purchase_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
                res.render('tmpl/price_competitive/new.html', {payment_terms: config.get('payment_terms'),sa: sa, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),user:req.session.user.name,cus:cus,enqy:enqy});    
       });
     });
   });
 });
router.get('/autovendor/:v', function (req, res) {
    db.query.selectDb('customer', " company=" + req.session.user.cur_company + " AND tag='vendor'  AND status='active' AND name like '%" + req.params.v + "%'", function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/vendorbyid/:id', function (req, res) {
    db.query.selectDb('customer', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.post('/autoitem', function (req, res) {
    var rb = req.body;
    var cnd = '';
    if (rb.hsn != '-1')
        cnd = " AND i.hsn_code='" + rb.hsn + "' ";
    var sql="SELECT i.*,SUM(spl.quantity) tot_qnty FROM send_plan_list spl INNER JOIN item i ON i.id = spl.rawitem  WHERE spl.company=" + req.session.user.cur_company + "  AND  ( i.code like '%" + rb.term + "%' OR i.specification like '%" + rb.term + "%') " + cnd +" GROUP BY spl.rawitem LIMIT 20";
    db.query.selectCustomDb(sql , function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/itembyid/:id', function (req, res) {
    db.query.selectDb('item', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/shippingbyid/:id', function (req, res) {
    db.query.selectDb('customer_shipping', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/edit/:id', function (req, res) {
     db.query.selectCustomDb("SELECT * from  customer  WHERE status<>'delete' AND tag='vendor'", function (cus) {
       db.query.selectCustomDb("SELECT * from  purchase_enquiry  WHERE status<>'delete'", function (enqy) {  
         db.query.selectDb('purchase_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
           db.query.getPriceCompetitiveEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
             res.render('tmpl/price_competitive/edit.html',{payment_terms: config.get('payment_terms'),row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),cus:cus,enqy:enqy,sa:sa});
        });
      });
    });
  });
});
router.get('/purchaseOrder/:id', function (req, res) {
    var fyear = getFYear(new Date());
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
        db.query.selectCustomDb("SELECT MAX(autono) no FROM purchase_order WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
                    var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var pono = (set[0].porder_pre == 'AI') ? no : ((set[0].porder_pre == 'FYEAR') ? fyear : set[0].porder_pre);
                    pono += (set[0].porder_pre != '') ? set[0].porder_div : '';
                    pono += (set[0].porder_cen == 'AI') ? no : ((set[0].porder_cen == 'FYEAR') ? fyear : set[0].porder_cen);
                    pono += (set[0].porder_cen != '') ? set[0].porder_div : '';
                    pono += (set[0].porder_su == 'AI') ? no : ((set[0].porder_su == 'FYEAR') ? fyear : set[0].porder_su); 

            db.query.selectDb('purchase_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
              db.query.getPurchaseOrderDetails({id: req.params.id, company: req.session.user.cur_company}, function (row) {
                 db.query.selectDb('purchase_order', "price_competitive='"+req.params.id+"' AND company=" + req.session.user.cur_company, function (po) {
                  if(po.length > 0){
                  db.query.getNewPurchaseOrderDetails({id: req.params.id, company: req.session.user.cur_company}, function (newrow) {
                      console.log("1");
                      console.log(newrow);
                    res.render('tmpl/price_competitive/purchase_order.html',{payment_terms: config.get('payment_terms'),row:newrow, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),pono:pono,sa:sa,pcid:req.params.id});
                     });
                    }
                    else{
                        console.log("2");
                        console.log(row);
                      res.render('tmpl/price_competitive/purchase_order.html',{payment_terms: config.get('payment_terms'),row: row,comstate: req.session.company.state,tax_slab: config.get('tax_slab'),pono:pono,sa:sa,pcid:req.params.id});  
                    }
               });
             });
           });
         });
       });
     });
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('price_competitive', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('price_competitive', " id=" + req.params.id, function (cid) {
            db.query.deleteDb('price_competitive_item', " price_competitive=" + req.params.id, function (cid) {
                db.query.deleteDb('purchase_additional', " price_competitive=" + req.params.id, function (cid) {
                            generateLogFile({user: req.session.user.id, type: 'price competitive delete', time: new Date(), refer: sl});
                            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                    });
        });
    });
});

router.post('/save', function (req, res) {
    var rb = req.body;
    var dt = rb.enquiry_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.enquiry_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectCustomDb("SELECT MAX(autono) no FROM price_competitive WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {

    var no = (maxno[0].no + 1).toString().padStart(5, '0');
    if (typeof rb.sid !== 'undefined') {
        db.query.updateDb('price_competitive', {note: rb.note,vendor: rb.vendor,date: bdate,total_amount: rb.total_amount,modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
            db.query.deleteDb('price_competitive_item', " price_competitive=" + rb.sid, function (cid) {});
            db.query.deleteDb('purchase_additional', " price_competitive=" + rb.sid, function (cid) {});
            insertPriceCompetativeDetail(rb, rb.sid, req);
            generateLogFile({user: req.session.user.id, type: 'price competitive modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': rb.sid, 'msg': 'Success'}));
        });
    } else { 
                db.query.insertDb('price_competitive', {company: req.session.user.cur_company,enquiry:rb.enquiry_no,autono:no, fyear: fyear, note: rb.note,vendor: rb.vendor,date: bdate,total_amount: rb.total_amount,created_by: req.session.user.id}, function (pid) {
                    insertPriceCompetativeDetail(rb, pid, req);
                    generateLogFile({user: req.session.user.id, type: 'price competitive creation', time: new Date(), refer_id: pid});
                    res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
                });
              
              }
});

});
function insertPriceCompetativeDetail(rb, pid, req) {
    Object.keys(rb.item).forEach(function (k) {
        db.query.insertDb('price_competitive_item', {price_competitive:pid, item: rb.item[k].id, quantity: rb.item[k].q, unit: rb.item[k].u, rate: rb.item[k].p,  final_amount: rb.item[k].t,tax:rb.item[k].ts,tax_amount:rb.item[k].tx}, function (sid) {});
    });
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('purchase_additional', {price_competitive: pid, price_competitive_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
    });
} 
router.post('/purchaseOrdersave', function (req, res) {
    var rb = req.body;
    var dt = rb.purchase_order_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.purchase_order_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectCustomDb("SELECT MAX(autono) no FROM purchase_order WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            var no = (maxno[0].no + 1).toString().padStart(5, '0');
            console.log("sid "+rb.sid.length);
    if (rb.sid.length > 0) {
        db.query.updateDb('purchase_order', {vendor: rb.vendor,po_date: bdate,total_amount: rb.total_amount,modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
            db.query.deleteDb('purchase_order_item', " purchase_order=" + rb.sid, function (cid) {});
            db.query.deleteDb('purchase_order_additional', " purchase_order=" + rb.sid, function (cid) {});
            insertPurchaseOrderDetail(rb,rb.sid,req);
            generateLogFile({user: req.session.user.id, type: 'purchase order modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': rb.sid, 'msg': 'Success'}));
        });
    } else { 
        db.query.insertDb('purchase_order', {price_competitive:rb.pcid,company: req.session.user.cur_company,purchase_enquiry:rb.enquiry_no,autono:no, fyear: fyear,po_no:rb.purchase_order_no,vendor: rb.vendor,po_date: bdate,total_amount: rb.total_amount,created_by: req.session.user.id}, function (pid) {
        db.query.updateDb('purchase_enquiry', {enquiry_status:'accepted',modify_by:req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.enquiry_no, function (pid) {});
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

} 



module.exports = router;