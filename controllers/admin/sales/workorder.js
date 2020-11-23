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
                  var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-status_change" class="dropdown-item s-l-wsc userrole-cls" title="status_change"> Status Change </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-edit" class="dropdown-item s-l-dv userrole-cls"  title="doc_view"> View Document </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-edit" class="dropdown-item s-l-e userrole-cls"  title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-commercial_part" class="dropdown-item s-l-sc userrole-cls" title="commercial_part"> Commercial Part </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-techno_commercial" class="dropdown-item s-l-v userrole-cls" title="techno_commercial"> Techno Commercial Part </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-despatch_insurance" class="dropdown-item s-l-di userrole-cls" title="despatch_insurance"> Despatch Insurance </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-product_list" class="dropdown-item s-l-pl userrole-cls" title="product_list"> Product List </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-delete" class="dropdown-item s-l-m userrole-cls" title="Mapping">Mapping</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                } else if (data[0][i].wo_status == 'accepted'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Planed</a>';
                     //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" data-permission = "sales-workorder-techno_commercial" title="techno_commercial"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" data-permission = "sales-workorder-delete" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" data-permission = "sales-workorder-edit" title="Edit"> <i class="fa fa-wrench"></i> </button>&nbsp<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-pl userrole-cls" data-permission = "sales-workorder-product_list" title="product_list"> <i class="fa fa-star"></i> </button>';
                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-success" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-edit" class="dropdown-item s-l-dv userrole-cls"  title="doc_view"> View Document </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-edit" class="dropdown-item s-l-e userrole-cls"  title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-commercial_part" class="dropdown-item s-l-sc userrole-cls" title="commercial_part"> Commercial Part </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-techno_commercial" class="dropdown-item s-l-v userrole-cls" title="techno_commercial"> Techno Commercial Part </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-despatch_insurance" class="dropdown-item s-l-di userrole-cls" title="despatch_insurance"> Despatch Insurance </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-product_list" class="dropdown-item s-l-pl userrole-cls" title="product_list"> Product List </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-delete" class="dropdown-item s-l-m userrole-cls" title="Mapping">Mapping</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                        //action = '</button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i>';
                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-danger" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-workorder-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                     }
                    arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>', data[0][i].wo_no ,data[0][i].offer_no, pstatus, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
    var fyear = getFYear(new Date());
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
                    res.render('tmpl/workorder/new.html',{workorderno:workorderno,ordertype:ordertype,row:row});
          });
         });
        });
      });
  });
router.get('/autosalesperson/:v', function (req, res) {
    db.query.selectDb('sales_agent', " company=" + req.session.user.cur_company + "  AND status='active' AND name like '%" + req.params.v + "%'", function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/getcustomer/:id', function (req, res) {
    db.query.selectCustomDb("SELECT c.*,cs.id as csid,cs.label,sa.name as salesagent,sa.id as said FROM offer o INNER JOIN customer c ON o.customer = c.id INNER JOIN customer_shipping cs ON c.default_shipping = cs.id LEFT JOIN sales_agent sa ON sa.id = o.sales_agent  WHERE o.id='"+req.params.id+"' ", function (cusn) {
        res.end(JSON.stringify(cusn[0]));
    });
});

router.get('/salespersonbyid/:id', function (req, res) {
    db.query.selectDb('sales_agent', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/autoofferno/:v', function (req, res) {
    db.query.selectDb('offer', " offer_status='accepted' AND company=" + req.session.user.cur_company + "  AND status='active' AND offer_no like '%" + req.params.v + "%'", function (row) {
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
        db.query.selectDb('offer', " offer_status='accepted' AND  company=" + req.session.user.cur_company, function (ofr) {
        res.render('tmpl/workorder/edit.html',{woid:req.params.id,ofr:ofr,ordertype:ordertype,row:row});
      });
    });
    });
//});
});
router.get('/commercial/:id', function (req, res) {
    db.query.getCommercialworkorder({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        res.render('tmpl/workorder/commercial.html',{wocomid:req.params.id,row:row});
      });
  //  });
   // });
//});
});
router.get('/techno_commercial/:id', function (req, res) {
  jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
    var sql = "SELECT wo.id as woid,c.id,wo.shipping,c.company_name,cs.label,cs.address,cs.city,cs.state,cs.country,cs.zip,cs.gst FROM `workorder` wo INNER JOIN customer c on c.id=wo.customer LEFT JOIN customer_shipping cs ON cs.id = wo.shipping WHERE wo.id="+req.params.id;
    db.query.selectCustomDb(sql, function (row) {
      db.query.getTechnoCommercialworkorder({id: req.params.id, company: req.session.user.cur_company}, function (wotc) {
        console.log(wotc.sa);
        res.render('tmpl/workorder/techno_commercial.html',{row:row[0],wotcid:req.params.id,wotc:wotc,state: state,country: country});
    });
      });
  });
  });
});
router.get('/despatch_insurance/:id', function (req, res) {
     jsonfile.readFile('config/transportname.json', function (err, transportname) {
       jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
    var sql = "SELECT wo.id,c.company_name,c.address,c.state,c.zip,c.city,c.gst,c.code FROM `workorder` wo INNER JOIN customer c on c.id=wo.customer  WHERE wo.id="+req.params.id;
    db.query.selectCustomDb(sql, function (row) {
        db.query.selectDb('transport', " company=" + req.session.user.cur_company, function (tran) {
         var sql = "SELECT wodi.id as desis,wodi.insurance_brone_by,wodi.insurance_details,wodi.transport_mode,wodi.delivery_basis,wodi.road_permit,wodi.transport,c.company_name,c.id,c.address,c.state,c.zip,c.city,c.gst,c.code FROM `workorder_despatchinsurance` wodi INNER JOIN customer c on c.id=wodi.customer  WHERE wodi.workorder="+req.params.id;
        db.query.selectCustomDb(sql, function (wodirow) {  

        res.render('tmpl/workorder/despatch_insurance.html',{row:row[0],wodi:req.params.id,tran: tran,transportname:transportname,wodirow:wodirow[0],state: state,country: country});
     });
    });
      });
  });
    });
    });
});
router.get('/product_list/:id', function (req, res) {
    db.query.selectDb('workorder', " id=" + req.params.id , function (worder) {
      db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name ='PR PARTS' ORDER BY mm.id" , function (prcategory) {
        db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name ='TRIM PARTS' ORDER BY mm.id" , function (trimcategory) {
          db.query.selectCustomDb("SELECT mm.* FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name = 'Spindle' ORDER BY mm.id" , function (stemcategory) {
            db.query.selectCustomDb("SELECT * FROM `prod_unit` WHERE status<>'delete' ORDER BY numbering ASC", function (unit) {
              db.query.selectCustomDb("SELECT * FROM `special_service` ORDER BY service_no ASC", function (spclsrvc) {
                db.query.getOfferproductEdit({id: worder[0].offer, company: req.session.user.cur_company,woid:req.params.id}, function (row) {
              res.render('tmpl/workorder/product_list.html',{payment_terms: config.get('payment_terms'),row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),woid:req.params.id,prcategory:prcategory,trimcategory:trimcategory,stemcategory:stemcategory,unit:unit,spclsrvc:spclsrvc});
              });
            });
          });
        });
      });
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
router.post('/approvedwo', function (req, res) {
    var rb = req.body;
    db.query.selectDb('workorder', " id=" + rb.statusid , function (worder) {
    db.query.getOfferproductEdit({id: worder[0].offer, company: req.session.user.cur_company,woid:rb.statusid}, function (row) {
      if(row.item.length > 0){
        if(row.newitem.length < 1){
         for(var k in row.item){
         db.query.insertDb('workorder_item', {offer: row.item[k].offerid,workorder:rb.statusid, item: row.item[k].id, quantity: row.item[k].quantity, unit: row.item[k].punit, rate: row.item[k].rate, discount:row.item[k].discount,profit:row.item[k].profit, final_amount:row.item[k].final_amount,tax:row.item[k].itax,tax_amount:row.item[k].tax_amount,description:row.item[k].description}, function (sid) {});
        }
        for(var k in row.saf){
          db.query.insertDb('workorder_aditional', {offer: row.saf[k].ofrid,workorder:rb.statusid, offer_additional: row.saf[k].id, amount: row.saf[k].samount,tax:row.saf[k].tax,tax_amount:row.saf[k].tax_amount}, function (sid) {});
         }
        }
        var pvar = {wo_status:'accepted'};
            db.query.updateDb('workorder', pvar, rb.statusid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'workorder',item_id:rb.statusid,status_tag:'accepted',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'workorder status acctepted', time: new Date(), refer_id: rb.statusid});
              });
            });
            res.send({'code': '1', 'msg': 'Success'});
          }
          else if(row.item.length < 1 ){
            if(row.newitem.length < 1){
              res.send({'code': '2', 'msg': 'Success'});
            }
            else{
              var pvar = {wo_status:'accepted'};
              db.query.updateDb('workorder', pvar, rb.statusid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'workorder',item_id:rb.statusid,status_tag:'accepted',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'workorder status acctepted', time: new Date(), refer_id: rb.statusid});
              });
            });
            res.send({'code': '1', 'msg': 'Success'});
            }
          }
        });
      
  });
    
});
router.post('/rejectwo', function (req, res) {
    var rb = req.body;
var pvar = {offer_status:'rejected'};
            db.query.updateDb('workorder', pvar, rb.statusid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'workorder',item_id:rb.statusid,status_tag:'rejected',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'workorder status rejected', time: new Date(), refer_id: rb.statusid});
              });
            });
    res.send({'code': '1', 'msg': 'Success'});
});



router.post('/save', function (req, res) {
    var rb = req.body;
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
                db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,offer:rb.offer_no,company: req.session.user.cur_company,wo_date:wo_date,order_date:order_date,ach_date:ach_date,over_all_cdd:over_all_cdd, circulated_date: circulated_date,order_recived_date:order_recive_date,order_type:rb.order_type,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,formal_order:rb.formal_order,pr_status:rb.pr_status,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.woid, function (eid) {
                   // if(rb.order_acknowledgement !='' OR rb.or)
                   db.query.deleteDb('sales_agent_credit', " workorder=" + rb.woid, function (said) {
                   insertSalesagentDetail(rb, rb.woid,req);
                    generateLogFile({user: req.session.user.id, type: 'workorder modification', time: new Date(), refer_id: rb.woid});
                    res.end(JSON.stringify({'code': rb.woid, 'msg': 'Success'}));
                });
               });
            }

else{
    db.query.insertDb('workorder', {autono:no,wo_no:workorderno,fyear:fyear,customer: rb.customer,shipping:rb.shipping,offer:rb.offer_no,company: req.session.user.cur_company,wo_date:wo_date,order_date:order_date,ach_date:ach_date,over_all_cdd:over_all_cdd, circulated_date: circulated_date,order_recived_date:order_recive_date,order_type:rb.order_type,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,formal_order:rb.formal_order,pr_status:rb.pr_status, created_by: req.session.user.id, modify_by: req.session.user.id}, function (pid) {
    insertSalesagentDetail(rb, pid,req);
    db.query.insertofferitemdetails({company: req.session.user.cur_company,woid:pid,ofr:rb.offer_no}, function (row) {});
    insertofferAdditionaldetails(rb,rb.offer_no,pid,req);
       generateLogFile({user: req.session.user.id, type: 'workorder creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
});
     });
});
function insertofferAdditionaldetails(rb,oid,woid,req){
db.query.selectCustomDb("SELECT * FROM offer_aditional WHERE offer='" + oid + "' ", function (ofradd) {
   if(ofradd.length > 0){
    for(var k in ofradd){
      db.query.insertDb('workorder_aditional', {offer: oid,workorder:woid, offer_additional: ofradd[k].offer_additional, amount: ofradd[k].amount,tax:ofradd[k].tax,tax_amount:ofradd[k].tax_amount}, function (sid) {});
    }
  }
});

}
router.post('/commercialsave', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());
    var order_date = moment(rb.order_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var over_all_cdd = moment(rb.over_all_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    
   
    db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,order_date:order_date,over_all_cdd:over_all_cdd,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,created_by: req.session.user.id, modify_by: req.session.user.id},rb.wocomid ,function (pid) {
     db.query.deleteDb('workorder_commercial', " workorder=" + rb.wocomid, function (cid) {});
    db.query.insertDb('workorder_commercial', {company:req.session.user.cur_company,workorder:rb.wocomid,order_acknowledgement:rb.order_acknowledgement,drawing_approval:rb.drawing_approval,qap_approval:rb.qap_approval,proforma_invoice:rb.proforma_invoice,despatch_clearance:rb.despatch_clearance,arrange_way_bill:rb.arrange_way_bill,packing_list:rb.packing_list,excise_invoice:rb.excise_invoice,Commercial_invoice:rb.Commercial_invoice,Specify_other:rb.Specify_other,ld_clause:rb.ld_clause,created_by:req.session.user.id}, function (did) {});
        db.query.deleteDb('sales_agent_credit', " workorder=" + rb.wocomid, function (cid) {});
    insertSalesagentDetail(rb, rb.wocomid,req);
       generateLogFile({user: req.session.user.id, type: 'workorder commercial creation', time: new Date(), refer_id: rb.wocomid});
         res.end(JSON.stringify({'code': rb.wocomid, 'msg': 'Success'}));

   });
});

router.post('/technocommercialsave', function (req, res) {
    var rb = req.body;
    if(typeof rb.wtcid != 'undefined' ){
      db.query.updateDb('workorder_technocommercial', {shipping:rb.shipping,drawing_approval:rb.drawing_approval,quality_assurance_plan:rb.quality_assurance_plan,inspection_by:rb.inspection_by,guarantee_period:rb.guarantee_period,guarantee_days:rb.guarantee_days,other_test:rb.other_test,tpi_charges:rb.tpi_charges,freight_option:rb.freight_option,freight_charges:rb.freight_charges,price_based_on:rb.price_based_on,packing_forwarding:rb.packing_forwarding,excise_duty:rb.excise_duty,sale_tax:rb.sale_tax,surcharge:rb.surcharge,cgst:rb.cgst,sgst:rb.sgst,igst:rb.igst,payment_terms:rb.payment_terms,bank_guarantee:rb.bank_guarantee,created_by:req.session.user.id},rb.wtcid, function (did) {});
      db.query.deleteDb('acknowledgement_shipping', " workorder_technocommercial=" + rb.wtcid, function (cid) {});
      insertacknowledgementshipping(rb,rb.wtcid,req);
      generateLogFile({user: req.session.user.id, type: 'workorder techno commercial creation', time: new Date(), refer_id: rb.wtcid});
      res.end(JSON.stringify({'code': rb.wtcid, 'msg': 'Success'}));
    }
    else{
    db.query.insertDb('workorder_technocommercial', {company:req.session.user.cur_company,workorder:rb.wotcid,shipping:rb.shipping,drawing_approval:rb.drawing_approval,quality_assurance_plan:rb.quality_assurance_plan,inspection_by:rb.inspection_by,guarantee_period:rb.guarantee_period,guarantee_days:rb.guarantee_days,other_test:rb.other_test,tpi_charges:rb.tpi_charges,freight_option:rb.freight_option,freight_charges:rb.freight_charges,price_based_on:rb.price_based_on,packing_forwarding:rb.packing_forwarding,excise_duty:rb.excise_duty,sale_tax:rb.sale_tax,surcharge:rb.surcharge,cgst:rb.cgst,sgst:rb.sgst,igst:rb.igst,payment_terms:rb.payment_terms,bank_guarantee:rb.bank_guarantee,created_by:req.session.user.id}, function (did) {
      insertacknowledgementshipping(rb,did,req);
      generateLogFile({user: req.session.user.id, type: 'workorder techno commercial creation', time: new Date(), refer_id: did});
      res.end(JSON.stringify({'code': did, 'msg': 'Success'}));
       });
   }
});
function insertacknowledgementshipping(rb,wtid,req){
  Object.keys(rb.mod).forEach(function (k) {
    db.query.insertDb('acknowledgement_shipping', {company:req.session.user.cur_company,workorder:rb.wotcid,workorder_technocommercial:wtid,label:rb.mod[k].label,city:rb.mod[k].city,state:rb.mod[k].state,country:rb.mod[k].country,address:rb.mod[k].address,zip:rb.mod[k].zip,gstin:rb.mod[k].gstin}, function (did) {});
  });
}
router.post('/despatchinsurancesave', function (req, res) {
    var rb = req.body;
   // db.query.updateDb('workorder', {customer: rb.customer,shipping:rb.shipping,order_date:order_date,over_all_cdd:over_all_cdd,mtc_issue_for:rb.mtc_issue_for,order_no:rb.order_no,order_quantity:rb.order_quantity,order_material_value:rb.order_material_value,created_by: req.session.user.id, modify_by: req.session.user.id},rb.wocomid ,function (pid) {
     db.query.deleteDb('workorder_despatchinsurance', " workorder=" + rb.wodi, function (cid) {
      db.query.insertDb('workorder_despatchinsurance', {company:req.session.user.cur_company,workorder:rb.wodi,insurance_brone_by:rb.insurance_brone_by,insurance_details:rb.insurance_details,transport_mode:rb.transport_mode,delivery_basis:rb.delivery_basis,road_permit:rb.road_permit,transport:rb.transport,created_by:req.session.user.id}, function (did) {});
       generateLogFile({user: req.session.user.id, type: 'workorder Despatch insurance creation', time: new Date(), refer_id: rb.wodi});
         res.end(JSON.stringify({'code': rb.wodi, 'msg': 'Success'}));

   });
});
router.get('/getsubservicecode', function (req, res) {
          var pid = req.query.pid;
          var prodid = pid.replace(/"/g,"");
        var sql="SELECT * FROM workorder_special_service  where  workorder_item ='"+prodid+"'";
          console.log(sql);
          db.query.selectCustomDb(sql , function (itemcode) {    
           res.end(JSON.stringify(itemcode))
      });
});
router.post('/productsave', function (req, res) {
    var rb = req.body;
db.query.selectCustomDb("SELECT id,offer FROM workorder_item WHERE  workorder='" + rb.woid + "' AND item='"+rb.id+"' ", function (newitm) {
  var spcl = rb.spclsrvc;
      spclarr = [];
      spclarr = spcl.split(',');
      console.log(spclarr);
     if(newitm.length > 0){
       console.log("calling from wo_item_update");
       db.query.updateDbCustom('workorder_item', {offer: rb.sid,workorder:rb.woid, item: rb.id,quantity: rb.q, tax:rb.ts, unit: rb.u, rate: rb.p,tax_amount:rb.tx, discount: rb.d, final_amount: rb.t,description:rb.gnrldescription,pr_parts:rb.pr,trim_parts:rb.trim,stem:rb.stem,item_code:rb.itmcode,special_description:rb.spcldescription,hydraulic_body:rb.hydbody,hydraulic_seat:rb.hydseat,pneumatic_seat:rb.pneumseat,hydroback_seat:rb.hydbackseat,inspection:rb.inspection,standard:rb.standard,enq_serial_no:rb.enq_serial_no,loa_serial_no:rb.loa_serial_no,po_serial_no:rb.po_serial_no,discount_numeric:rb.discount_numeric},"item='"+rb.id+"' AND workorder='"+rb.woid+"' ", function (oiid) {
       db.query.selectCustomDb("SELECT * FROM workorder_item WHERE item='"+rb.id+"' AND workorder='"+rb.woid+"'",function(newofritm){
       db.query.deleteDb('workorder_special_service', "workorder='"+rb.woid+"' AND workorder_item='"+newofritm[0].id+"'" , function (cid) {});
       insertspecialdetails(rb,rb.woid,newofritm[0].id,spclarr,req);
       });
       });
       insertUpdateSalesDetail(rb,rb.sid, rb.woid, req);
     }
     else{
       console.log("calling from wo_item_insert11");
       db.query.insertDb('workorder_item', {offer: rb.sid,workorder:rb.woid, item: rb.id,quantity: rb.q, tax:rb.ts, unit: rb.u, rate: rb.p,tax_amount:rb.tx, discount: rb.d, final_amount: rb.t,description:rb.gnrldescription,pr_parts:rb.pr,trim_parts:rb.trim,stem:rb.stem,item_code:rb.itmcode,special_description:rb.spcldescription,hydraulic_body:rb.hydbody,hydraulic_seat:rb.hydseat,pneumatic_seat:rb.pneumseat,hydroback_seat:rb.hydbackseat,inspection:rb.inspection,standard:rb.standard,enq_serial_no:rb.enq_serial_no,loa_serial_no:rb.loa_serial_no,po_serial_no:rb.po_serial_no,discount_numeric:rb.discount_numeric}, function (oiid) {
       insertspecialdetails(rb,rb.woid,oiid,spclarr,req);
       });
       insertUpdateSalesDetail(rb,rb.sid, rb.woid, req);
     }       
  generateLogFile({user: req.session.user.id, type: 'workorder item modification', time: new Date(), refer_id: rb.woid});
  res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
});
});
router.post('/finalproductsave', function (req, res) {
    var rb = req.body;
    insertFinalSalesDetail(rb, rb.woid,rb.sid, req);

  generateLogFile({user: req.session.user.id, type: 'workorder item modification', time: new Date(), refer_id: rb.woid});
  res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
});
function insertFinalSalesDetail(rb, pid, sid, req) {
    Object.keys(rb.saf).forEach(function (k) {
      db.query.selectCustomDb("SELECT id,workorder FROM workorder_aditional WHERE  workorder='" + pid + "' AND offer_additional='"+rb.saf[k].id+"' ", function (newAdd) {
        if(newAdd.length > 0){
          console.log("calling from insertFinalSalesAdditionalDetail update");
        if (rb.saf[k].v > 0) {
            db.query.updateDbCustom('workorder_aditional', {offer: sid,workorder:pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx},"workorder='"+pid+"' AND offer_additional='"+rb.saf[k].id+"'", function (sid) {});
        }
      }else{
        console.log("calling from insertFinalSalesAdditionalDetail insert");
        if (rb.saf[k].v > 0) {
        db.query.insertDb('workorder_aditional', {offer: sid,workorder:pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
      }
      });
    });
    Object.keys(rb.item).forEach(function (k) {
      db.query.selectCustomDb("SELECT id,workorder FROM workorder_item WHERE  workorder='" + pid + "' AND item='"+rb.item[k].id+"' ", function (newitm) {
        var spcl = rb.item[k].spclsrvc;
        spclarr = [];
        spclarr = spcl.split(',');
        console.log(spclarr);
        if(newitm.length > 0){
          console.log("calling from insertFinalSalesItemDetail update");
            db.query.updateDbCustom('workorder_item', {workorder: pid,offer:sid, item: rb.item[k].id,quantity: rb.item[k].q,tax:rb.item[k].ts,tax_amount:rb.item[k].tx,unit: rb.item[k].u, rate: rb.item[k].p, discount: rb.item[k].d, final_amount: rb.item[k].t,description:rb.item[k].gnrldescription,pr_parts:rb.item[k].pr,trim_parts:rb.item[k].trim,stem:rb.item[k].stem,item_code:rb.item[k].itmcode,special_description:rb.item[k].spcldescription,hydraulic_body:rb.item[k].hydbody,hydraulic_seat:rb.item[k].hydseat,pneumatic_seat:rb.item[k].pneumseat,hydroback_seat:rb.item[k].hydbackseat,inspection:rb.item[k].inspection,standard:rb.item[k].standard,enq_serial_no:rb.item[k].enq_serial_no,loa_serial_no:rb.item[k].loa_serial_no,po_serial_no:rb.item[k].po_serial_no,discount_numeric:rb.item[k].discount_numeric},"item='"+rb.item[k].id+"' AND workorder='"+pid+"' ", function (sid) {
            });
            db.query.deleteDb('workorder_special_service', "workorder='"+pid+"' AND workorder_item='"+newitm[0].id+"'" , function (cid) {});
            insertspecialdetails(rb,pid,newitm[0].id,spclarr,req);
        }else{
          console.log("calling from insertFinalSalesItemDetail insert");
          db.query.insertDb('workorder_item', {workorder: pid,offer:sid, item: rb.item[k].id,quantity: rb.item[k].q,tax:rb.item[k].ts,tax_amount:rb.item[k].tx,unit: rb.item[k].u, rate: rb.item[k].p, discount: rb.item[k].d, final_amount: rb.item[k].t,description:rb.item[k].gnrldescription,pr_parts:rb.item[k].pr,trim_parts:rb.item[k].trim,stem:rb.item[k].stem,item_code:rb.item[k].itmcode,special_description:rb.item[k].spcldescription,hydraulic_body:rb.item[k].hydbody,hydraulic_seat:rb.item[k].hydseat,pneumatic_seat:rb.item[k].pneumseat,hydroback_seat:rb.item[k].hydbackseat,inspection:rb.item[k].inspection,standard:rb.item[k].standard,enq_serial_no:rb.item[k].enq_serial_no,loa_serial_no:rb.item[k].loa_serial_no,po_serial_no:rb.item[k].po_serial_no,discount_numeric:rb.item[k].discount_numeric}, function (wiid) {
          insertspecialdetails(rb,pid,wiid,spclarr,req);
          });
        }
      });
    });
}
function insertspecialdetails(rb,pid,wiid,spclarr,req) {
  console.log("calling from insertspecialdetails");
  var subarr=[],sub='';
    Object.keys(spclarr).forEach(function (k) {
       sub = spclarr[k];
       subarr = sub.split(':');
            db.query.insertDb('workorder_special_service', {workorder: pid, workorder_item: wiid,company:req.session.user.cur_company,special_service:subarr[0],sub_special_service:subarr[1]}, function (sid) {});
    });
}
router.get('/docview/:id', function (req, res) {
    db.query.selectDb('document', "doc_type='workorder' AND ref_id=" + req.params.id , function (row) {
        db.query.selectDb('workorder', "id=" + req.params.id, function (wo) {
          db.query.selectDb('document', "doc_type='offer' AND ref_id=" + wo[0].offer , function (ofrdoc) {
            db.query.selectDb('offer', "id=" + wo[0].offer, function (ofr) {
              db.query.selectDb('document', "doc_type='enquiry' AND ref_id=" + ofr[0].enquiry , function (enqdoc) {
        res.render('tmpl/workorder/workorder_doc.html', {row: row[0],sid:req.params.id,ofrdoc:ofrdoc[0],enqdoc:enqdoc[0]});
                });
        });
          });
 });
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
    form.uploadDir = config.get('workorder_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        

        var docname = '';

          if (typeof (files.wo_doc) != 'undefined' ){
              docname = ctime + files.wo_doc.name;
           }
        if (fields.imgid !== 'undefined') {
            if (docname === '')
                docname = fields.owo_doc;
            var pvar = {doc:docname};
            
            db.query.updateDb('document', pvar, fields.imgid, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'Workorder document modification', time: new Date(), refer_id: fields.imgid});
          });
        }
        
        else{  
            db.query.insertDb('document', {doc:docname,ref_id:fields.woid,doc_type:'workorder'}, function (did) {
            generateLogFile({user: req.session.user.id, type: 'Workorder document creation', time: new Date(), refer_id: did});
            });
            }
             res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
     });

});

function insertSalesagentDetail(rb, pid, req) {
    Object.keys(rb.addfield).forEach(function (k) {
        db.query.insertDb('sales_agent_credit', {workorder: pid, sales_agent: rb.addfield[k].id, amount: rb.addfield[k].amount,created_by: req.session.user.id, modify_by: req.session.user.id}, function (sid) {});
    });
}
function insertSalesDetail(rb, pid, woid, req) {
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('workorder_aditional', {offer: pid,workorder:woid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
    });  
}
function insertUpdateSalesDetail(rb, pid, woid, req) {
  console.log("calling from insertUpdateSalesDetail");
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.updateDbCustom('workorder_aditional', {offer: pid,workorder:woid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx},"workorder='"+woid+"' AND offer_additional='"+rb.saf[k].id+"'", function (sid) {});
        }
    });
}
router.get('/mapping/:id', function (req, res) {
  db.query.selectCustomDb("SELECT * FROM workorder WHERE id = '"+req.params.id+"'",function(wrkorder){
res.render('tmpl/workorder/mappinglist.html',{wrkorder:wrkorder[0]});
});
 });
router.post('/ajaxgetmappinglist/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getWOMappingVen({company: req.session.user.cur_company, status: 'active',id:req.params.id, val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                if (data[0][i].item_mapping_status == 'yes') {
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md m-b-5">Yes</a>';
                 }
                 else if(data[0][i].item_mapping_status == 'no'){
                   pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md m-b-5">No</a>';
                 }
                 action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-success" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].itmid + '" data-oid="' + data[0][i].offer + '" data-wid="' + data[0][i].id + '" data-wiid="' + data[0][i].wiid + '" class="dropdown-item s-l-im" title="Item_mapping">Mapping</a>'
                       action += '</div>'
                       action += '</div>'
                    // pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Active</a>';
                 arrObj.data.push([data[0][i].size_id + '<br/><span style="font-size: 11px;">' + data[0][i].code + '</span>', data[0][i].desp,pstatus,action]);
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/itemmapping', function (req, res) {
  var iid = req.query.itmid;
  var itmid = iid.replace(/"/g,"");
  var pid = req.query.oid;
  var oid = pid.replace(/"/g,"");
  var sid = req.query.wid;
  var woid = sid.replace(/"/g,"");
  var cid = req.query.wiid;
  var wiid = cid.replace(/"/g,"");
  db.query.selectCustomDb("SELECT wi.id,cmd.size_id FROM workorder_item wi INNER JOIN component_mapping_details cmd ON wi.item = cmd.item WHERE wi.id = '"+wiid+"'",function(witm){
  db.query.getWoMappingdetailsByItemId({itm:itmid,wiid:wiid}, function (mapping) {
    db.query.newWoMappingdetailsByItemId({itm:itmid,woid:woid,wiid:wiid}, function (newmapping) {
        res.render('tmpl/workorder/item_mapping.html',{worder:woid,newmapping:newmapping,mapping:mapping,witm:witm[0]});
    });
  });
  });
});
router.get('/getprodspecificitem/:id', function (req, res) {
  db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON ccn.id = mm.component_category_name WHERE mm.component_category_name ="+req.params.id, function (row) {
    res.end(JSON.stringify(row));
  });
});
router.post('/mappingsave', function (req, res) {
    var rb = req.body;
    Object.keys(rb.item).forEach(function (k) {
      var prod='';
        if(rb.item[k].imapid != undefined){
          db.query.updateDbCustom('workorder_mapping', {material:rb.item[k].prod,workorder:rb.wo,workorder_item:rb.wiid,item:rb.item[k].id,component_mapping:rb.item[k].cm},"id=" + rb.item[k].imapid ,function (compmap) {
              generateLogFile({user: req.session.user.id, type: 'mapping updating', time: new Date(), refer_id: compmap});
          });
          res.end(JSON.stringify({'code': 2, 'msg': 'Success'}));
        }
        else{
          db.query.insertDb('workorder_mapping', {company:req.session.user.cur_company,material:rb.item[k].prod,workorder:rb.wo,workorder_item:rb.wiid,item:rb.item[k].id,component_mapping:rb.item[k].cm},function (compmap) {
              generateLogFile({user: req.session.user.id, type: 'mapping creating', time: new Date(), refer_id: compmap});
          });
          res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
          }
        });    
  });


module.exports = router;