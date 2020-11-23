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
    res.render('tmpl/purchase_enquiry/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getPurchaseEnquiryVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                 var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                    
                   
                    //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="monthlyplan_sheet"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                     //if( data[0][i].plan_status == 'pending'){
                       pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    
                      var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-dv" title="document_view"> View Document </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                                            
                     //var action = '<button data-id="' + data[0][i].rawitem + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 p-l-v custom-modal-button" title="View" > <i class="fa fa-eye"></i> </button>';
                      arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>',data[0][i].enquiry_no,data[0][i].date,data[0][i].submission_date,data[0][i].total_amount,action ]);
                      
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
    var fyear = getFYear(new Date());
    db.query.selectCustomDb("SELECT * from  customer  WHERE status<>'delete'", function (cus) { 
    db.query.selectCustomDb("SELECT * from  asset_location  WHERE status<>'delete'", function (ship) {   
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
        db.query.selectCustomDb("SELECT MAX(autono) no FROM purchase_enquiry WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            db.query.selectDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
                db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {

                    var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var enquiryno = (set[0].enquiry_pre == 'AI') ? no : ((set[0].enquiry_pre == 'FYEAR') ? fyear : set[0].enquiry_pre);
                    enquiryno += (set[0].enquiry_pre != '') ? set[0].enquiry_div : '';
                    enquiryno += (set[0].enquiry_cen == 'AI') ? no : ((set[0].enquiry_cen == 'FYEAR') ? fyear : set[0].enquiry_cen);
                    enquiryno += (set[0].enquiry_cen != '') ? set[0].enquiry_div : '';
                    enquiryno += (set[0].enquiry_su == 'AI') ? no : ((set[0].enquiry_su == 'FYEAR') ? fyear : set[0].enquiry_su);
                  
                    res.render('tmpl/purchase_enquiry/new.html', {currency:currency,payment_terms: config.get('payment_terms'), su: su, sa: sa, comstate: req.session.company.state, enquiryno: enquiryno,set: set[0],tax_slab: config.get('tax_slab'),user:req.session.user.name,cus:cus,ship:ship});
                   
                 });
                });
              });
    });
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
    db.query.selectDb('asset_location', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/edit/:id', function (req, res) {
    db.query.selectCustomDb("SELECT * from  customer  WHERE status<>'delete'", function (cus) { 
    db.query.selectCustomDb("SELECT * from  asset_location  WHERE status<>'delete'", function (ship) {   
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.getPurchaseEnquiryEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        console.log(row);
        var fnlcus=[];
        for(var k in row.cus){
            fnlcus.push(row.cus[k].id);
        }
        res.render('tmpl/purchase_enquiry/edit.html',{payment_terms: config.get('payment_terms'),currency:currency,row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),cus:cus,ship:ship,fnlcus:fnlcus});
    });
});
});
});
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('purchase_enquiry', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('purchase_enquiry', " id=" + req.params.id, function (cid) {
            db.query.deleteDb('purchase_enquiry_item', " purchase_enquiry=" + req.params.id, function (cid) {
                db.query.deleteDb('purchase_additional', " purchase_enquiry=" + req.params.id, function (cid) {
                            generateLogFile({user: req.session.user.id, type: 'purchase enquiry delete', time: new Date(), refer: sl});
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
    var submission_date = moment(rb.submission_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var ven = [];
    ven = rb.vendor;
    var fnlven = ven.join();
    db.query.selectCustomDb("SELECT MAX(autono) no FROM purchase_enquiry WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {

            var no = (maxno[0].no + 1).toString().padStart(5, '0');
    if (typeof rb.sid !== 'undefined') {
        db.query.updateDb('purchase_enquiry', {enquiry_note: rb.enquiry_note,enquiry_terms:rb.enquiry_terms_note, vendor: fnlven,shipping:rb.shipping, date: bdate, submission_date:submission_date,total_amount: rb.total_amount,modify_by:req.session.user.id,drawing_no:rb.drawing_no, modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
            db.query.deleteDb('purchase_enquiry_item', " purchase_enquiry=" + rb.sid, function (cid) {});
            db.query.deleteDb('purchase_additional', " purchase_enquiry=" + rb.sid, function (cid) {});
            insertSalesDetail(rb, rb.sid, req);
            generateLogFile({user: req.session.user.id, type: 'purchase enquiry modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': rb.sid, 'msg': 'Success'}));
        });
    } else { 
        
               
                db.query.insertDb('purchase_enquiry', {company: req.session.user.cur_company,enquiry_no:rb.enquiry_no,autono:no, fyear: fyear, enquiry_note: rb.enquiry_note,enquiry_terms:rb.enquiry_terms_note, vendor: fnlven,shipping:rb.shipping, date: bdate, submission_date:submission_date,total_amount: rb.total_amount,drawing_no:rb.drawing_no,created_by: req.session.user.id}, function (pid) {
                    insertSalesDetail(rb, pid, req);
                    generateLogFile({user: req.session.user.id, type: 'purchase enquiry creation', time: new Date(), refer_id: pid});
                    res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
                });
              
              }
});

});
function insertSalesDetail(rb, pid, req) {
    Object.keys(rb.item).forEach(function (k) {
        db.query.insertDb('purchase_enquiry_item', {purchase_enquiry: pid, item: rb.item[k].id, quantity: rb.item[k].q, unit: rb.item[k].u, rate: rb.item[k].p,  final_amount: rb.item[k].t,tax:rb.item[k].ts,tax_amount:rb.item[k].tx,description:rb.item[k].desc}, function (sid) {});
    });
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('purchase_additional', {purchase_enquiry: pid, purchase_enquiry_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
    });

} 



module.exports = router;