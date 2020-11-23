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

        res.render('tmpl/workorder/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getworkorderVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
               // var action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-workorder-techno_commercial" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="techno_commercial"> <i class="fa fa-eye"></i> </button>&nbsp;';
                if (data[0][i].wo_status == 'pending') {
                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" data-permission = "sales-workorder-commercial_part" title="commercial_part"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" data-permission = "sales-workorder-delete"  title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" data-permission = "sales-workorder-edit" title="Edit"> <i class="fa fa-wrench"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" data-permission = "sales-workorder-techno_commercial" title="techno_commercial"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-purple m-b-5 s-l-di userrole-cls" data-permission = "sales-workorder-despatch_insurance" title="despatch_insurance"> <i class="fa fa-music"></i> </button>&nbsp<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-pl userrole-cls" data-permission = "sales-workorder-product_list" title="product_list"> <i class="fa fa-star" title="product_list"></i> </button>';
                    var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" data-permission = "sales-workorder-edit" title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" data-permission = "sales-workorder-delete"  title="Delete"> Delete </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" data-permission = "sales-workorder-commercial_part" title="commercial_part"> Commercial Part </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" data-permission = "sales-workorder-techno_commercial" title="techno_commercial"> Techno Commercial Part </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-purple m-b-5 s-l-di userrole-cls" data-permission = "sales-workorder-despatch_insurance" title="despatch_insurance"> Despatch Insurance </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-pl userrole-cls" data-permission = "sales-workorder-product_list" title="product_list"> Product List </button></li>'
                       action +='</ul>'
                       action +='</div>'
                } else if (data[0][i].wo_status == 'accepted'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" data-permission = "sales-workorder-techno_commercial" title="techno_commercial"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" data-permission = "sales-workorder-delete" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" data-permission = "sales-workorder-edit" title="Edit"> <i class="fa fa-wrench"></i> </button>&nbsp<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-pl userrole-cls" data-permission = "sales-workorder-product_list" title="product_list"> <i class="fa fa-star"></i> </button>';
                     action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" data-permission = "sales-workorder-edit" title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" data-permission = "sales-workorder-delete"  title="Delete"> Delete </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" data-permission = "sales-workorder-commercial_part" title="commercial_part"> Commercial Part </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" data-permission = "sales-workorder-techno_commercial" title="techno_commercial"> Techno Commercial Part </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-purple m-b-5 s-l-di userrole-cls" data-permission = "sales-workorder-despatch_insurance" title="despatch_insurance"> Despatch Insurance </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-pl userrole-cls" data-permission = "sales-workorder-product_list" title="product_list"> Product List </button></li>'
                       action +='</ul>'
                       action +='</div>'
                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                        //action = '</button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i>';
                        action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                      // action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" data-permission = "sales-workorder-edit" title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" data-permission = "sales-workorder-delete"  title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'
                     }
                    arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>', data[0][i].wo_no ,data[0][i].offer_no, pstatus, action]);
            }
            //console.log(arrObj);
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
    var fyear = getFYear(new Date());
    //console.log('fyar '+fyear);
    jsonfile.readFile('config/order_type.json', function (err, ordertype) {
        db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
         db.query.selectCustomDb("SELECT MAX(autono) no FROM workorder WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
          db.query.selectDb('offer', " offer_status='accepted' AND  company=" + req.session.user.cur_company, function (row) {
            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var workorderno = (set[0].wo_pre == 'AI') ? no : ((set[0].wo_pre == 'FYEAR') ? fyear : set[0].wo_pre);
                    workorderno += (set[0].wo_pre != '') ? set[0].wo_div : '';
                    workorderno += (set[0].wo_cen == 'AI') ? no : ((set[0].wo_cen == 'FYEAR') ? fyear : set[0].wo_cen);
                    workorderno += (set[0].wo_cen != '') ? set[0].wo_div : '';
                    workorderno += (set[0].wo_su == 'AI') ? no : ((set[0].wo_su == 'FYEAR') ? fyear : set[0].wo_su);
                    //console.log('workorderno '+workorderno);
                    res.render('tmpl/workorder/new.html',{workorderno:workorderno,ordertype:ordertype,row:row});
          });
         });
        });
      });
        
});
router.get('/autosalesperson/:v', function (req, res) {
  console.log("abc"+req.params.v);
    db.query.selectDb('sales_agent', " company=" + req.session.user.cur_company + "  AND status='active' AND name like '%" + req.params.v + "%'", function (row) {
        console.log(row.name);
        res.end(JSON.stringify(row));
    });
});
router.post('/getcustomer', function (req, res) {
  var rb = req.body;
    db.query.selectCustomDb("SELECT c.*,cs.id as csid,cs.label FROM offer o INNER JOIN customer c ON o.customer = c.id INNER JOIN customer_shipping cs ON c.default_shipping = cs.id  WHERE o.offer_no='"+rb.offer_no+"' ", function (cusn) {
        res.end(JSON.stringify(cusn[0]));
    });
});

router.get('/salespersonbyid/:id', function (req, res) {
  console.log("cba "+req.params.id);
    db.query.selectDb('sales_agent', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/autoofferno/:v', function (req, res) {
    db.query.selectDb('offer', " offer_status='accepted' AND company=" + req.session.user.cur_company + "  AND status='active' AND offer_no like '%" + req.params.v + "%'", function (row) {
        console.log(row);
        res.end(JSON.stringify(row));
    });
});
router.get('/offernobyid/:id', function (req, res) {
    db.query.selectDb('offer', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/edit/:id', function (req, res) {
    jsonfile.readFile('config/order_type.json', function (err, ordertype) {
    db.query.getworkorderEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        console.log(row.su.offer_no);
        db.query.selectDb('offer', " offer_status='accepted' AND  company=" + req.session.user.cur_company, function (ofr) {
        res.render('tmpl/workorder/edit.html',{woid:req.params.id,ofr:ofr,ordertype:ordertype,row:row});
      });
    });
    });
//});
});

router.get('/commercial/:id', function (req, res) {
    db.query.getCommercialworkorder({id: req.params.id, company: req.session.user.cur_company}, function (row) {
       // console.log('getCommercialworkorder '+row.swoc[0]);
        res.render('tmpl/workorder/commercial.html',{wocomid:req.params.id,row:row});
      });
  //  });
   // });
//});
});
router.get('/techno_commercial/:id', function (req, res) {
    var sql = "SELECT wo.id,c.company_name,c.address,c.state,c.zip,c.city,c.gst,c.code FROM `workorder` wo INNER JOIN customer c on c.id=wo.customer  WHERE wo.id="+req.params.id;
    db.query.selectCustomDb(sql, function (row) {
        db.query.selectDb('workorder_technocommercial', " workorder=" + req.params.id, function (wotc) {
        res.render('tmpl/workorder/techno_commercial.html',{row:row[0],wotcid:req.params.id,wotc:wotc[0]});
    });
    });
});
router.get('/despatch_insurance/:id', function (req, res) {
     jsonfile.readFile('config/transportname.json', function (err, transportname) {
    var sql = "SELECT wo.id,c.company_name,c.address,c.state,c.zip,c.city,c.gst,c.code FROM `workorder` wo INNER JOIN customer c on c.id=wo.customer  WHERE wo.id="+req.params.id;
    db.query.selectCustomDb(sql, function (row) {
        db.query.selectDb('transport', " company=" + req.session.user.cur_company, function (tran) {
         var sql = "SELECT wodi.id as desis,wodi.insurance_brone_by,wodi.insurance_details,wodi.transport_mode,wodi.delivery_basis,wodi.road_permit,wodi.transport,c.company_name,c.id,c.address,c.state,c.zip,c.city,c.gst,c.code FROM `workorder_despatchinsurance` wodi INNER JOIN customer c on c.id=wodi.customer  WHERE wodi.workorder="+req.params.id;
    db.query.selectCustomDb(sql, function (wodirow) {  

        res.render('tmpl/workorder/despatch_insurance.html',{row:row[0],wodi:req.params.id,tran: tran,transportname:transportname,wodirow:wodirow[0]});
     });
    });
    });
    });
});
router.get('/product_list/:id', function (req, res) {
  console.log(req.params.id);
  db.query.selectDb('workorder', " id=" + req.params.id , function (worder) {
   db.query.getOfferEdit({id: worder[0].offer, company: req.session.user.cur_company}, function (row) {
        console.log(row);
        res.render('tmpl/workorder/product_list.html',{payment_terms: config.get('payment_terms'),row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),woid:req.params.id});
    });
  });
});

router.get('/autocustomer/:v', function (req, res) {
    db.query.selectDb('customer', " company=" + req.session.user.cur_company + "  AND status='active' AND code like '%" + req.params.v + "%'", function (row) {
        res.end(JSON.stringify(row));
    });
});


router.get('/delete/:id', function (req, res) {
    db.query.selectDb('workorder', " status<>'active' AND id=" + req.params.id, function (sl) {
        db.query.updateDb('workorder', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
            db.query.deleteDb('sales_agent_credit', " workorder=" + req.params.id, function (said) {
            generateLogFile({user: req.session.user.id, type: 'workorder delete', time: new Date(), refer: sl});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        });
    });
              
});




router.post('/save', function (req, res) {
    var rb = req.body;
    console.log("cus "+rb.customer);
    console.log("shipping "+rb.shipping);
    var fyear = getFYear(new Date());
    var wo_date = moment(rb.wo_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var order_recive_date = moment(rb.order_recive_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var order_date = moment(rb.order_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var ach_date = moment(rb.ach_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var circulated_date = moment(rb.circulated_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var recived_date = moment(rb.recived_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var over_all_cdd = moment(rb.over_all_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    
   db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
         db.query.selectCustomDb("SELECT MAX(autono) no FROM workorder WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {

            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var workorderno = (set[0].wo_pre == 'AI') ? no : ((set[0].wo_pre == 'FYEAR') ? fyear : set[0].wo_pre);
                    workorderno += (set[0].wo_pre != '') ? set[0].wo_div : '';
                    workorderno += (set[0].wo_cen == 'AI') ? no : ((set[0].wo_cen == 'FYEAR') ? fyear : set[0].wo_cen);
                    workorderno += (set[0].wo_cen != '') ? set[0].wo_div : '';
                    workorderno += (set[0].wo_su == 'AI') ? no : ((set[0].wo_su == 'FYEAR') ? fyear : set[0].wo_su);
 if (typeof rb.woid !== 'undefined') {
                db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,offer:rb.offer_no,company: req.session.user.cur_company,wo_date:wo_date,order_date:order_date,ach_date:ach_date,over_all_cdd:over_all_cdd, circulated_date: circulated_date,recived_date:recived_date,order_recived_date:order_recive_date,order_type:rb.order_type,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,formal_order:rb.formal_order,pr_status:rb.pr_status,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.woid, function (eid) {
                   // if(rb.order_acknowledgement !='' OR rb.or)
                   db.query.deleteDb('sales_agent_credit', " workorder=" + rb.woid, function (said) {
                   insertSalesagentDetail(rb, rb.woid,req);
                    generateLogFile({user: req.session.user.id, type: 'workorder modification', time: new Date(), refer_id: rb.woid});
                    res.end(JSON.stringify({'code': rb.woid, 'msg': 'Success'}));
                });
               });
            }

else{
    db.query.insertDb('workorder', {autono:no,wo_no:workorderno,fyear:fyear,customer: rb.customer,shipping:rb.shipping,offer:rb.offer_no,company: req.session.user.cur_company,wo_date:wo_date,order_date:order_date,ach_date:ach_date,over_all_cdd:over_all_cdd, circulated_date: circulated_date,recived_date:recived_date,order_recived_date:order_recive_date,order_type:rb.order_type,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,formal_order:rb.formal_order,pr_status:rb.pr_status, created_by: req.session.user.id, modify_by: req.session.user.id}, function (pid) {
    insertSalesagentDetail(rb, pid,req);
    console.log('pid '+pid);
       generateLogFile({user: req.session.user.id, type: 'workorder creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
});
     });
});

router.post('/commercialsave', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());
    var order_date = moment(rb.order_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var over_all_cdd = moment(rb.over_all_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,order_date:order_date,over_all_cdd:over_all_cdd,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,created_by: req.session.user.id, modify_by: req.session.user.id},rb.wocomid ,function (pid) {
     db.query.deleteDb('workorder_commercial', " workorder=" + rb.wocomid, function (cid) {});
    db.query.insertDb('workorder_commercial', {company:req.session.user.cur_company,workorder:rb.wocomid,order_acknowledgement:rb.order_acknowledgement,qap_approval:rb.qap_approval,proforma_invoice:rb.proforma_invoice,despatch_clearance:rb.despatch_clearance,arrange_way_bill:rb.arrange_way_bill,packing_list:rb.packing_list,excise_invoice:rb.excise_invoice,Commercial_invoice:rb.Commercial_invoice,Specify_other:rb.Specify_other,ld_clause:rb.ld_clause,created_by:req.session.user.id}, function (did) {});
        db.query.deleteDb('sales_agent_credit', " workorder=" + rb.wocomid, function (cid) {});
    insertSalesagentDetail(rb, rb.wocomid,req);
       generateLogFile({user: req.session.user.id, type: 'workorder commercial creation', time: new Date(), refer_id: rb.wocomid});
         res.end(JSON.stringify({'code': rb.wocomid, 'msg': 'Success'}));

   });
});

router.post('/technocommercialsave', function (req, res) {
    var rb = req.body;
    
   
   // db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,order_date:order_date,over_all_cdd:over_all_cdd,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,created_by: req.session.user.id, modify_by: req.session.user.id},rb.wocomid ,function (pid) {
     db.query.deleteDb('workorder_technocommercial', " workorder=" + rb.wotcid, function (cid) {
    db.query.insertDb('workorder_technocommercial', {company:req.session.user.cur_company,workorder:rb.wotcid,drawing_approval:rb.drawing_approval,quality_assurance_plan:rb.quality_assurance_plan,inspection_by:rb.inspection_by,guarantee_period:rb.guarantee_period,guarantee_days:rb.guarantee_days,other_test:rb.other_test,tpi_charges:rb.tpi_charges,freight_option:rb.freight_option,freight_charges:rb.freight_charges,price_based_on:rb.price_based_on,packing_forwarding:rb.packing_forwarding,excise_duty:rb.excise_duty,sale_tax:rb.sale_tax,surcharge:rb.surcharge,cgst:rb.cgst,sgst:rb.sgst,igst:rb.igst,payment_terms:rb.payment_terms,bank_guarantee:rb.bank_guarantee,created_by:req.session.user.id}, function (did) {});
       generateLogFile({user: req.session.user.id, type: 'workorder techno commercial creation', time: new Date(), refer_id: rb.wotcid});
         res.end(JSON.stringify({'code': rb.wotcid, 'msg': 'Success'}));

   });
});
router.post('/despatchinsurancesave', function (req, res) {
    var rb = req.body;

   // db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,order_date:order_date,over_all_cdd:over_all_cdd,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,created_by: req.session.user.id, modify_by: req.session.user.id},rb.wocomid ,function (pid) {
     db.query.deleteDb('workorder_despatchinsurance', " workorder=" + rb.wodi, function (cid) {
    db.query.insertDb('workorder_despatchinsurance', {company:req.session.user.cur_company,workorder:rb.wodi,customer:rb.vendor_code,insurance_brone_by:rb.insurance_brone_by,insurance_details:rb.insurance_details,transport_mode:rb.transport_mode,delivery_basis:rb.delivery_basis,road_permit:rb.road_permit,transport:rb.transport,created_by:req.session.user.id}, function (did) {});
       generateLogFile({user: req.session.user.id, type: 'workorder Despatch insurance creation', time: new Date(), refer_id: rb.wodi});
         res.end(JSON.stringify({'code': rb.wodi, 'msg': 'Success'}));

   });
});

router.post('/productsave', function (req, res) {
    var rb = req.body;
        
       
            db.query.deleteDb('workorder_item', " workorder=" + rb.woid, function (cid) {});
            db.query.deleteDb('workorder_aditional', " workorder=" + rb.woid, function (cid) {});
            insertSalesDetail(rb, rb.sid, rb.woid, req);
            generateLogFile({user: req.session.user.id, type: 'offer modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
        

});


function insertSalesagentDetail(rb, pid, req) {
    Object.keys(rb.addfield).forEach(function (k) {
        console.log('rb '+rb.addfield[k].id);
        console.log('pid '+pid);
        db.query.insertDb('sales_agent_credit', {workorder: pid, sales_agent: rb.addfield[k].id, amount: rb.addfield[k].amount,created_by: req.session.user.id, modify_by: req.session.user.id}, function (sid) {});
    });
}
function insertSalesDetail(rb, pid, woid, req) {
    Object.keys(rb.item).forEach(function (k) {
        db.query.insertDb('workorder_item', {offer: pid,workorder:woid, item: rb.item[k].id, quantity: rb.item[k].q, unit: rb.item[k].u, rate: rb.item[k].p, discount: rb.item[k].d,profit:rb.item[k].pft, final_amount: rb.item[k].t,tax:rb.item[k].ts,tax_amount:rb.item[k].tx}, function (sid) {});
    });
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('workorder_aditional', {offer: pid,workorder:woid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
            //db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: rb.saf[k].acc, amount: (rb.saf[k].v+rb.saf[k].tx)}, function (sid) {});
        }
    });
    
} 


module.exports = router;