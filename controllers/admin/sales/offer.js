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
        res.render('tmpl/offer/list.html');
   // });
});
router.post('/amendmentdoc', function (req, res) {
         var rb = req.body;
    db.query.selectDb('offer', "id="+rb.sid, function (row) {

        req.session.amendment = rb;
                req.session.save();
            console.log("session "+req.session.amendment.offer_no );

       res.end(JSON.stringify({'code': '1', 'msg': 'Success',rb:rb}));
    });
});
router.get('/amendment', function (req, res) {
    var no = req.session.amendment;
    var amendmentno = (+no.amendment_no + 1);
    console.log("amendmentno "+amendmentno);
        res.render('tmpl/offer/amendmentdoc.html',{rb:req.session.amendment,amendmentno:amendmentno});
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
    db.query.getOfferVen({company: req.session.user.cur_company, val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
               // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Partial</a>';
               // var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-success m-b-5 s-l-wo" title="workorder"> <i class="fa fa-thumbs-o-up"></i> </button>';
                 var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                // var action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                if (data[0][i].offer_status == 'pending' && data[0][i].estatus == 'os') {

                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                   // action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i></button>';
                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="dropdown-item s-l-sc userrole-cls" title="status_change"> Status Change </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-v userrole-cls" title="view">View</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-dv userrole-cls" title="doc_view"> View Document </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eid="' + data[0][i].enquiry + '" data-permission = "sales-offer-edit" class="dropdown-item s-l-ad userrole-cls" title="Add_Details">Add Details</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="dropdown-item s-l-es userrole-cls" title="Edit_Summary">Edit Summary</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-m userrole-cls" title="Mapping">Mapping</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                 } 
                 else if (data[0][i].offer_status == 'pending' && data[0][i].estatus != 'os') {

                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                   // action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i></button>';
                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="dropdown-item s-l-sc userrole-cls" title="status_change"> Status Change </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-v userrole-cls" title="view">View</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-dv userrole-cls" title="doc_view"> View Document </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="dropdown-item s-l-e userrole-cls" title="Edit">Edit</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="dropdown-item s-l-es userrole-cls" title="Edit_Summary">Edit Summary</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-m userrole-cls" title="Mapping">Mapping</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                 }
                 else if (data[0][i].offer_status == 'accepted'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                      action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-success" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'

                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-v userrole-cls" title="view">View</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-dv userrole-cls" title="doc_view"> View Document </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="dropdown-item s-l-e userrole-cls" title="Edit">Edit</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="dropdown-item s-l-es userrole-cls" title="Edit_Summary">Edit Summary</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-m userrole-cls" title="Mapping">Mapping</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                     }
                     else if (data[0][i].offer_status == 'delete'){
                       pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Deleted</a>';
                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-danger" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-v userrole-cls" title="view">View</a>'
                       action += '</div>'
                       action += '</div>'
                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                        //action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-danger" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="dropdown-item s-l-v userrole-cls" title="view">View</a>'
                       action += '<a data-id="' + data[0][i].id + '" data-eosid="' + data[0][i].estatus + '" data-permission = "sales-offer-delete" class="dropdown-item s-l-d userrole-cls" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'
                     }
                    
                    arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>', data[0][i].offer_no, data[0][i].offer_date  , data[0][i].total_amount.toFixed(2) , pstatus, action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.post('/ajaxgetenqlist', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getofferEnquiryVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                //var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Partial</a>';
             action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-success" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"  class="dropdown-item s-l-od" title="offer_details">Add Offer Details</a>'
                       action += '<a data-id="' + data[0][i].id + '"  class="dropdown-item s-l-os" title="offer_summary">Add Offer Summery</a>'
                       action += '</div>'
                       action += '</div>'
                   // pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Active</a>';
                    arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>', data[0][i].enquiry_no, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.post('/approvedOffer', function (req, res) {
    var rb = req.body;
var pvar = {offer_status:'accepted'};
            db.query.updateDb('offer', pvar, rb.statusid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'offer',item_id:rb.statusid,status_tag:'accepted',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'offer status acctepted', time: new Date(), refer_id: rb.statusid});
              });
            });
    res.send({'code': '1', 'msg': 'Success'});
});
router.post('/rejectOffer', function (req, res) {
    var rb = req.body;
console.log('statusid '+rb.statusid);
var pvar = {offer_status:'rejected'};
            db.query.updateDb('offer', pvar, rb.statusid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'offer',item_id:rb.statusid,status_tag:'rejected',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'offer status rejected', time: new Date(), refer_id: rb.statusid});
              });
            });
    res.send({'code': '1', 'msg': 'Success'});
});
router.get('/new/:id', function (req, res) {
     var fyear = getFYear(new Date());
      db.query.selectCustomDb("SELECT c.* FROM enquiry e INNER JOIN customer c ON e.customer = c.id WHERE e.id ='"+req.params.id+"' ", function (cusname) {
        db.query.selectCustomDb("SELECT o.id,DATE_FORMAT(o.offer_date,'%m/%d/%Y') offer_date,o.offer_no,o.total_amount,o.offer_status,o.offer_validity,o.offer_note,o.tax,o.ld_clause,d.doc,d.id as imgid FROM offer o LEFT JOIN document d on o.id = d.ref_id WHERE o.status='active' AND d.doc_type='offer' AND o.enquiry ="+req.params.id, function (oldofr) {
          jsonfile.readFile('config/default.json', function (err, currency) {
            db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
              db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
                db.query.selectDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
                  db.query.selectDb('offer_term_conditions_fields', " company=" + req.session.user.cur_company, function (otc) {
                    db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {
                      db.query.selectDb('enquiry', "id="+req.params.id, function (enqry) {
                       db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name ='PR PARTS' ORDER BY mm.id" , function (prcategory) {
                         db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name ='TRIM PARTS' ORDER BY mm.id" , function (trimcategory) {
                           db.query.selectCustomDb("SELECT mm.* FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name = 'Spindle' ORDER BY mm.id" , function (stemcategory) {
                             db.query.selectCustomDb("SELECT otcf.name,otcf.id,otc.message FROM offer_term_conditions_fields otcf INNER JOIN offer_term_conditions otc ON otcf.id=otc.offer_term_conditions INNER JOIN offer o ON o.id = otc.offer WHERE o.enquiry ="+req.params.id, function (oldotc) {
                               db.query.selectCustomDb("SELECT * FROM `prod_unit` WHERE status<>'delete' ORDER BY numbering ASC", function (unit) {
                                db.query.selectCustomDb("SELECT * FROM `special_service` ORDER BY service_no ASC", function (spclsrvc) {
                                  db.query.selectCustomDb("SELECT * FROM `inspection` ORDER BY id ASC", function (inspec) {
                                    db.query.selectCustomDb("SELECT * FROM `currency` ORDER BY id ASC", function (crncy) {
                      //console.log("sa "+sa.id);
                            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                            //console.log(oldofr.length);
                            if(oldofr.length > 0){
                            db.query.selectCustomDb("SELECT p.id,i.quantity,i.id as ofritemid,i.standard,i.enq_serial_no,i.discount_numeric,i.unit punit,i.rate,i.tax,i.discount,i.final_amount,i.tax_amount,i.description,i.trim_parts,i.pr_parts,i.stem,i.special_description,i.hydraulic_body,i.hydraulic_seat,i.pneumatic_seat,i.item_code,i.hydroback_seat,i.inspection,p.name,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three,p.code,cmd.size_id,mm.short_code FROM `offer_item` i INNER JOIN item p ON p.id=i.item INNER JOIN component_mapping_details cmd ON p.id=cmd.item LEFT JOIN material_master mm ON mm.id = i.pr_parts WHERE i.offer='"+oldofr[0].id+"'", function (oitem){  
                              db.query.selectCustomDb("SELECT saf.account,saf.name,saf.id,saf.amount,sa.tax,sa.tax_amount,sa.amount samount FROM `sales_additional_fields` saf LEFT JOIN offer_aditional sa ON saf.id=sa.offer_additional AND sa.offer='"+oldofr[0].id+"'", function (saf) {
                                db.query.selectCustomDb("SELECT otcf.name,otcf.id,otc.message FROM `offer_term_conditions_fields` otcf LEFT JOIN offer_term_conditions otc ON otcf.id=otc.offer_term_conditions AND otc.offer='"+oldofr[0].id+"'", function (otcf) {
                                console.log(oitem);
                              res.render('tmpl/offer/new.html', {currency:currency,payment_terms: config.get('payment_terms'), su: su, sa: saf,oitem:oitem, comstate: req.session.company.state, offerno: oldofr[0].offer_no,oldofr:oldofr[0],set: set[0],tax_slab: config.get('tax_slab'),user:req.session.user.name,enquiryid:req.params.id,cusname:cusname[0],enqry:enqry[0],oldotc:otcf,otc:otc,prcategory:prcategory,trimcategory:trimcategory,stemcategory:stemcategory,unit:unit,spclsrvc:spclsrvc,inspec:inspec,crncy:crncy});
                             });
                            });
                            });
                            }
                            else{
                              var oog = [];
                            var offerno = (set[0].sales_offer_pre == 'AI') ? no : ((set[0].sales_offer_pre == 'FYEAR') ? fyear : set[0].sales_offer_pre);
                            offerno += (set[0].sales_offer_pre != '') ? set[0].sales_offer_div : '';
                            offerno += (set[0].sales_offer_cen == 'AI') ? no : ((set[0].sales_offer_cen == 'FYEAR') ? fyear : set[0].sales_offer_cen);
                            offerno += (set[0].sales_offer_cen != '') ? set[0].sales_offer_div : '';
                            offerno += (set[0].sales_offer_su == 'AI') ? no : ((set[0].sales_offer_su == 'FYEAR') ? fyear : set[0].sales_offer_su);
                           // console.log(offerno);
                            var amendmentno = (maxno[0].no + 1).toString().padStart(5,'0');
                           /* var amendmentno = (set[0].amendment_pre == 'AI') ? no : ((set[0].amendment_pre == 'FYEAR') ? fyear : set[0].amendment_pre);
                            amendmentno += (set[0].amendment_pre != '') ? set[0].amendment_div : '';
                            amendmentno += (set[0].amendment_cen == 'AI') ? no : ((set[0].amendment_cen == 'FYEAR') ? fyear : set[0].amendment_cen);
                            amendmentno += (set[0].amendment_cen != '') ? set[0].amendment_div : '';
                            amendmentno += (set[0].amendment_su == 'AI') ? no : ((set[0].amendment_su == 'FYEAR') ? fyear : set[0].amendment_su);*/
                            res.render('tmpl/offer/new.html', {currency:currency,payment_terms: config.get('payment_terms'), su: su, sa: sa,oitem:oog, comstate: req.session.company.state, offerno: offerno,amendmentno:amendmentno ,set: set[0],tax_slab: config.get('tax_slab'),user:req.session.user.name,enquiryid:req.params.id,cusname:cusname[0],oldofr:oldofr[0],enqry:enqry[0],otc:otc,oldotc:oldotc,prcategory:prcategory,trimcategory:trimcategory,stemcategory:stemcategory,unit:unit,spclsrvc:spclsrvc,inspec:inspec,crncy:crncy});
                                }
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
  });
});
router.post('/autoitem', function (req, res) {
    var rb = req.body;
    var cnd = '';
    if (rb.hsn != '-1')
        cnd = " AND i.hsn_code='" + rb.hsn + "' ";
    var sql="SELECT i.id,i.code,i.hsn_code,cmd.size_id FROM item i INNER JOIN component_mapping_details cmd ON i.id=cmd.item WHERE i.company=" + req.session.user.cur_company + "  AND i.status='active' AND i.category='finished' AND  ( cmd.size_id like '%" + rb.term + "%' OR i.code like '%" + rb.term + "%') " + cnd +" LIMIT 20";
    db.query.selectCustomDb(sql , function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/itembyid/:id', function (req, res) {
    db.query.selectCustomDb("SELECT i.*,cmd.hydraulic_body,cmd.hydraulic_seat,cmd.hydroback_seat,cmd.pneumatic_seat FROM item i INNER JOIN component_mapping_details cmd ON i.id = cmd.item WHERE i.id="+req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/getsubspclsrvc/:id', function (req, res) {
       db.query.selectCustomDb("SELECT * from sub_special_service WHERE special_service="+req.params.id, function (row) {
       res.end(JSON.stringify(row))
      });
});
router.get('/getsubprodcategory/:id', function (req, res) {
       db.query.selectCustomDb("SELECT * from prod_specification_item WHERE specification_id="+req.params.id, function (row) {
       res.end(JSON.stringify(row))
      });
});
router.get('/edit/:id', function (req, res) {
    jsonfile.readFile('config/default.json', function (err, currency) {
      db.query.selectCustomDb("SELECT * FROM `inspection` ORDER BY id ASC", function (inspec) {
    db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name ='PR PARTS' ORDER BY mm.id" , function (prcategory) {
      db.query.selectCustomDb("SELECT mm.*,ccn.component_name FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name ='TRIM PARTS' ORDER BY mm.id" , function (trimcategory) {
        db.query.selectCustomDb("SELECT mm.* FROM material_master mm INNER JOIN component_category_name ccn ON mm.component_category_name = ccn.id WHERE ccn.component_name = 'Spindle' ORDER BY mm.id" , function (stemcategory) {
          db.query.selectCustomDb("SELECT * FROM `prod_unit` WHERE status<>'delete' ORDER BY numbering ASC", function (unit) {
            db.query.selectCustomDb("SELECT * FROM `special_service` ORDER BY service_no ASC", function (spclsrvc) {
               db.query.selectCustomDb("SELECT * FROM `currency` ORDER BY id ASC", function (crncy) {
              db.query.getOfferEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
     //console.log(row);
     res.render('tmpl/offer/edit.html',{payment_terms: config.get('payment_terms'),currency:currency,row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),prcategory:prcategory,trimcategory:trimcategory,stemcategory:stemcategory,unit:unit,spclsrvc:spclsrvc,inspec:inspec,crncy:crncy});
      });
            });
             });
    });
  });
});
                             });
    });
  });
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('offer', " id=" + req.params.id, function (sl) {
      db.query.updateDb('offer', {offer_status:'delete',status:'delete', modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'offer delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });
  });
});
router.post('/save', function (req, res) {
    var rb = req.body;
    var dt = rb.offer_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.offer_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var quirydate = moment(rb.query_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var amendmentdate = moment(rb.amendment_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
   /* if (typeof rb.sid !== 'undefined') {
        db.query.updateDb('offer', {reference_no: rb.ref_no, fyear: fyear, offer_term_note: rb.p_terms_note,offer_note:rb.offer_note, customer: rb.customer, query_recive_date: quirydate, offer_date: bdate,offer_status:rb.offer_status,amendment_date:amendmentdate,enquiry_validity:rb.enquery_validity,total_amount: rb.total_amount, modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
            db.query.deleteDb('offer_item', " offer=" + rb.sid, function (cid) {});
            db.query.deleteDb('offer_aditional', " offer=" + rb.sid, function (cid) {});
            db.query.deleteDb('transaction_amount', " type='offer' AND ref_id=" + rb.sid, function (cid) {});
            db.query.deleteDb('tax_tran', " type='offer' AND tran_id=" + rb.sid, function (cid) {});
           // insertSalesDetail(rb, rb.sid, bdate, req);
            generateLogFile({user: req.session.user.id, type: 'offer modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': rb.sid, 'msg': 'Success'}));
        });
    } else { */
        db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
            db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
                var amendmentno = (maxno[0].no + 1).toString().padStart(5,'0');
                var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var offerno = (set[0].sales_offer_pre == 'AI') ? no : ((set[0].sales_offer_pre == 'FYEAR') ? fyear : set[0].sales_offer_pre);
                    offerno += (set[0].sales_offer_pre != '') ? set[0].sales_offer_div : '';
                    offerno += (set[0].sales_offer_cen == 'AI') ? no : ((set[0].sales_offer_cen == 'FYEAR') ? fyear : set[0].sales_offer_cen);
                    offerno += (set[0].sales_offer_cen != '') ? set[0].sales_offer_div : '';
                    offerno += (set[0].sales_offer_su == 'AI') ? no : ((set[0].sales_offer_su == 'FYEAR') ? fyear : set[0].sales_offer_su);
                    db.query.selectCustomDb("SELECT id,offer_no FROM offer WHERE company=" + req.session.user.cur_company + " AND offer_no='" + rb.offer_no + "' ", function (newofr) {
                      
                    console.log("offerno "+rb.offer_no);
                
                var upofrid = 0;
                if(rb.ofrid == '' && newofr.length > 0){
                   upofrid = newofr[0].id

                }
                else if(rb.ofrid != '' && newofr.length == 0){
                    upofrid = rb.ofrid;
                }
                 else if(rb.ofrid != '' && newofr.length > 0){
                    upofrid = newofr[0].id;
                }
                db.query.selectCustomDb("SELECT id,offer FROM offer_item WHERE  offer='" + upofrid + "' AND item='"+rb.id+"' ", function (newitm) {

                  var spcl = rb.spclsrvc;
                  spclarr = [];
                  spclarr = spcl.split(',');
                  console.log(spclarr);

                if(rb.ofrid != '' || newofr.length > 0){
                  console.log("calling from update");
                  db.query.updateDb('offer', {customer:rb.customer,currency:rb.currency,currency_value:rb.currency_value,offer_validity:rb.offer_validity,offer_note:rb.offer_note, offer_date: bdate,total_amount: rb.total_amount,sales_agent:rb.sales_agent,amount:rb.amount,ld_clause: rb.ld_clause, modification_date: new Date().toMysqlFormat()}, upofrid, function (pid) {
                  
                  //  db.query.updateDb('enquiry', {offer:rb.ofrid,offer_status:'od', modification_date: new Date().toMysqlFormat()}, rb.enquiry_id, function (eid) {}); 
                   if(newitm.length > 0){
                    console.log("calling from offer_item_update");
                    db.query.updateDbCustom('offer_item', {offer: upofrid, item: rb.id,quantity: rb.q,tax:rb.ts, unit: rb.u, rate: rb.p,tax_amount:rb.tx, discount: rb.d, final_amount: rb.t,description:rb.gnrldescription,pr_parts:rb.pr,trim_parts:rb.trim,stem:rb.stem,item_code:rb.itmcode,special_description:rb.spcldescription,hydraulic_body:rb.hydbody,hydraulic_seat:rb.hydseat,pneumatic_seat:rb.pneumseat,hydroback_seat:rb.hydbackseat,inspection:rb.inspection,standard:rb.standard,enq_serial_no:rb.enq_serial_no,discount_numeric:rb.discount_numeric},"item='"+rb.id+"' AND offer='"+upofrid+"' ", function (oiid) {
                    db.query.selectCustomDb("SELECT * FROM offer_item WHERE item='"+rb.id+"' AND offer='"+upofrid+"'",function(newofritm){
                    db.query.deleteDb('offer_special_service', "offer='"+upofrid+"' AND offer_item='"+newofritm[0].id+"'" , function (cid) {});
                    insertspecialdetails(rb,upofrid,newofritm[0].id,spclarr,req);
                    });
                    });
                   }
                   else{
                    console.log("calling from offer_item_insert11");
                    db.query.insertDb('offer_item', {offer: upofrid, item: rb.id,quantity: rb.q,tax:rb.ts, unit: rb.u, rate: rb.p,tax_amount:rb.tx, discount: rb.d, final_amount: rb.t,description:rb.gnrldescription,pr_parts:rb.pr,trim_parts:rb.trim,stem:rb.stem,item_code:rb.itmcode,special_description:rb.spcldescription,hydraulic_body:rb.hydbody,hydraulic_seat:rb.hydseat,pneumatic_seat:rb.pneumseat,hydroback_seat:rb.hydbackseat,inspection:rb.inspection,standard:rb.standard,enq_serial_no:rb.enq_serial_no,discount_numeric:rb.discount_numeric}, function (oiid) {
                    insertspecialdetails(rb,upofrid,oiid,spclarr,req);
                    });
                   }
                    insertUpdateSalesDetail(rb, upofrid, bdate, req);
                    insertUpdateTermsDetail(rb, upofrid, req);
                    generateLogFile({user: req.session.user.id, type: 'offer creation', time: new Date(), refer_id: upofrid});
                    res.end(JSON.stringify({'code': upofrid, 'msg': 'Success'}));
                  });
                }
                else{
                  console.log("calling from insert");
                  db.query.insertDb('offer', {enquiry:rb.enquiry_id,company: req.session.user.cur_company,currency:rb.currency,currency_value:rb.currency_value,offer_no:offerno,autono:no, fyear: fyear, offer_note:rb.offer_note, customer: rb.customer, offer_date: bdate, offer_prepared_by:req.session.user.id,offer_validity:rb.offer_validity,total_amount: rb.total_amount,total_quantity:rb.qnty,sales_agent:rb.sales_agent,amount:rb.amount,ld_clause: rb.ld_clause,created_by: req.session.user.id, modified_by: req.session.user.id}, function (pid) {
                  db.query.insertDb('offer_item', {offer: pid, item: rb.id,quantity: rb.q,tax:rb.ts,tax_amount:rb.tx, unit: rb.u, rate: rb.p, discount: rb.d, final_amount: rb.t,description:rb.gnrldescription,pr_parts:rb.pr,trim_parts:rb.trim,stem:rb.stem,item_code:rb.itmcode,special_description:rb.spcldescription,hydraulic_body:rb.hydbody,hydraulic_seat:rb.hydseat,pneumatic_seat:rb.pneumseat,hydroback_seat:rb.hydbackseat,inspection:rb.inspection,standard:rb.standard,enq_serial_no:rb.enq_serial_no,discount_numeric:rb.discount_numeric}, function (oiid) {
                  insertspecialdetails(rb,pid,oiid,spclarr,req);
                  });
                  //  db.query.updateDb('enquiry', {offer:pid, modification_date: new Date().toMysqlFormat()}, rb.enquiry_id, function (eid) {}); 
                    
                    insertSalesDetail(rb, pid, bdate, req);
                    insertTermsDetail(rb, pid, req);
                    generateLogFile({user: req.session.user.id, type: 'offer creation', time: new Date(), refer_id: pid});
                    res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
                });
              }
            });
              });
              });
        });
   // }
});
router.post('/finalsave', function (req, res) {
    var rb = req.body;
    var dt = rb.offer_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.offer_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var quirydate = moment(rb.query_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
      db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
        var amendmentno = (maxno[0].no + 1).toString().padStart(5,'0');
        var no = (maxno[0].no + 1).toString().padStart(5, '0');
           
            db.query.selectCustomDb("SELECT id,offer_no FROM offer WHERE company=" + req.session.user.cur_company + " AND offer_no='" + rb.offer_no + "' ", function (newofr) {
              
            console.log("offerno "+rb.offer_no);
    db.query.selectCustomDb("SELECT id,offer_no,enquiry FROM offer WHERE company=" + req.session.user.cur_company + " AND offer_no='" + rb.offer_no + "' ", function (newofr) {

      if(newofr.length > 0){
        console.log("calling from update121");
        db.query.updateDb('offer', {customer:rb.customer,offer_validity:rb.offer_validity,currency:rb.currency,currency_value:rb.currency_value,submit_status:'full',offer_note:rb.offer_note, offer_date: bdate,total_amount: rb.total_amount,sales_agent:rb.sales_agent,amount:rb.amount,ld_clause: rb.ld_clause, modification_date: new Date().toMysqlFormat()}, newofr[0].id, function (pid) {
          db.query.updateDb('enquiry', {offer:rb.ofrid,offer_status:'od', modification_date: new Date().toMysqlFormat()}, rb.enquiry_id, function (eid) {}); 
          insertFinalSalesDetail(rb, newofr[0].id, bdate, req);
          insertFinalTermsDetail(rb, newofr[0].id, req);
          generateLogFile({user: req.session.user.id, type: 'offer creation', time: new Date(), refer_id: newofr[0].id});
          res.end(JSON.stringify({'code': newofr[0].id, 'msg': 'Success'}));
        });
      }
      else{
        console.log("calling from insert121");
        db.query.insertDb('offer', {enquiry:rb.enquiry_id,company: req.session.user.cur_company,currency:rb.currency,currency_value:rb.currency_value,offer_no:rb.offer_no,autono:no, fyear: fyear,submit_status:'full' ,offer_note:rb.offer_note, customer: rb.customer, offer_date: bdate, offer_prepared_by:req.session.user.id,offer_validity:rb.offer_validity,total_amount: rb.total_amount,total_quantity:rb.qnty,sales_agent:rb.sales_agent,amount:rb.amount,ld_clause: rb.ld_clause,created_by: req.session.user.id, modified_by: req.session.user.id}, function (pid) {
          db.query.updateDb('enquiry', {offer:pid,offer_status:'od', modification_date: new Date().toMysqlFormat()}, rb.enquiry_id, function (eid) {});
          insertFinalSalesDetail(rb, pid, bdate, req);
          insertFinalTermsDetail(rb, pid, req);
          generateLogFile({user: req.session.user.id, type: 'offer creation', time: new Date(), refer_id: pid});
          res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
      });
    }
  });
  });
 
        });
   });
});
router.post('/amendmentsave', function (req, res) {
    var form = new formidable.IncomingForm();
    var rb1 = req.body;
    var ctime = new Date().getTime();
    form.uploadDir = config.get('user_logo_path');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        var docname = '';
        console.log(files);
          if (typeof (files.amendment_doc) != 'undefined' ){
              docname = ctime + files.amendment_doc.name;
              console.log(docname);
          }    
    var rb = req.session.amendment;
    db.query.selectDb('enquiry', "offer='"+rb.sid+"' AND company=" + req.session.user.cur_company, function (enqy) {
    var dt = rb.offer_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.offer_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var quirydate = moment(rb.query_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    console.log("bdate "+bdate);
    console.log("bdate123 "+rb.offer_date );
    var amendmentdate = moment(rb.amendment_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
       console.log("form "+rb.sid);
        db.query.updateDb('offer', {sales_agent:enqy[0].sales_agent,fyear: fyear,currency:rb.currency,currency_value:rb.currency_value,amendment_no:fields.amendmentno,offer_validity:rb.offer_validity,offer_note:rb.offer_note, customer: rb.customer, offer_date: bdate,total_amount: rb.total_amount,total_quantity:rb.qnty,amendment_date:new Date().toMysqlFormat(), modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
            db.query.insertDb('amendment_doc', {amendment_no:fields.amendmentno,a_doc:docname,offer_no:rb.offer_no,created_by:req.session.user.id}, function (did) {});
            
            insertFinalSalesDetail(rb, rb.sid, bdate, req);
            insertFinalTermsDetail(rb, rb.sid, req);
            generateLogFile({user: req.session.user.id, type: 'offer modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
        });
     });
  });
});
router.get('/bill/:id', function (req, res) {
    db.query.selectDb('offer', " id=" + req.params.id, function (offer) {
        res.render('tmpl/offer/bill.html', {sid: req.params.id, offer: offer[0]});
    });
});
router.get('/billbody/:id', function (req, res) {
  db.query.getBillOffer({id: req.params.id}, function (offer) {
    console.log("oid "+offer[0].offer_status);
    db.query.selectDb('bank', " id=" + req.session.company.default_bank, function (bank) {
      db.query.getBillTermsDetail({sid: req.params.id}, function (ofrotc) {
    if(offer[0].offer_status == 'os'){
      res.render('tmpl/offer/billbody_summary.html', {com: req.session.company, offer: offer[0],ofrotc:ofrotc,bank: bank});
    }
        db.query.getBillOfferDetail({sid: req.params.id}, function (si) {
          db.query.getBillOfferAdditional({sid: req.params.id}, function (sa) {
            res.render('tmpl/offer/billbody.html', {com: req.session.company, offer: offer[0],ofrotc:ofrotc,si: si, sa: sa, bank: bank});
          });
        });
      });
    });
  });              
});
router.get('/enquerylist', function (req, res) {
res.render('tmpl/offer/enquirylist.html');
});
router.get('/summary/:id', function (req, res) {
 var fyear = getFYear(new Date());
  db.query.selectCustomDb("SELECT c.*,e.sales_agent FROM enquiry e INNER JOIN customer c ON e.customer = c.id WHERE e.id ="+req.params.id, function (cusname) {
    jsonfile.readFile('config/default.json', function (err, currency) {
      db.query.selectDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
        db.query.selectDb('offer_term_conditions_fields', " company=" + req.session.user.cur_company, function (otc) {
          db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
            db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
              db.query.selectDb('enquiry', "id="+req.params.id, function (enqry) {
                db.query.selectCustomDb("SELECT * FROM `currency` ORDER BY id ASC", function (crncy) {
                var no = (maxno[0].no + 1).toString().padStart(5, '0');
                var offerno = (set[0].sales_offer_pre == 'AI') ? no : ((set[0].sales_offer_pre == 'FYEAR') ? fyear : set[0].sales_offer_pre);
                offerno += (set[0].sales_offer_pre != '') ? set[0].sales_offer_div : '';
                offerno += (set[0].sales_offer_cen == 'AI') ? no : ((set[0].sales_offer_cen == 'FYEAR') ? fyear : set[0].sales_offer_cen);
                offerno += (set[0].sales_offer_cen != '') ? set[0].sales_offer_div : '';
                offerno += (set[0].sales_offer_su == 'AI') ? no : ((set[0].sales_offer_su == 'FYEAR') ? fyear : set[0].sales_offer_su);
                res.render('tmpl/offer/offersummary.html', {currency:currency,payment_terms: config.get('payment_terms'),  comstate: req.session.company.state, offerno: offerno,set: set[0],tax_slab: config.get('tax_slab'),user:req.session.user.name,enquiryid:req.params.id,cusname:cusname[0],otc:otc,sa:sa,crncy:crncy});
                });
              });
            });
          });
        });
      });
    });
  });
});
router.get('/editsummary/:id', function (req, res) {
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.getOfferEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
      db.query.selectCustomDb("SELECT * FROM `currency` ORDER BY id ASC", function (crncy) {
        console.log(row);
      res.render('tmpl/offer/offersummary_edit.html',{payment_terms: config.get('payment_terms'),currency:currency,row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab'),crncy:crncy});
    });
   });
  });
});
router.get('/docview/:id', function (req, res) {
    db.query.selectDb('document', "doc_type='offer' AND ref_id=" + req.params.id, function (row) {
      console.log(row);
      db.query.selectDb('offer', "id=" + req.params.id, function (ofr) {
        db.query.selectDb('document', "doc_type='enquiry' AND ref_id=" + ofr[0].enquiry, function (doc) {
        res.render('tmpl/offer/offerdoc.html', {row: row[0],doc:doc[0],sid:req.params.id});
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
    form.uploadDir = config.get('offer_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        var docname = '';

          if (typeof (files.offer_doc) != 'undefined' ){
              docname = ctime + files.offer_doc.name;
           }
        if (fields.imgid !== 'undefined') {
            if (docname === '')
                docname = fields.ooffer_doc;
            var pvar = {doc:docname};
            
            db.query.updateDb('document', pvar, fields.imgid, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'Offer document modification', time: new Date(), refer_id: fields.imgid});
          });
        }
        
        else{  
            db.query.insertDb('document', {doc:docname,ref_id:fields.offerid,doc_type:'offer'}, function (did) {
            generateLogFile({user: req.session.user.id, type: 'Offer document creation', time: new Date(), refer_id: did});
            });
            }
             res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
     });
});
router.post('/summarysave', function (req, res) {
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('offer_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        var dt = fields.offer_date.split("/");
        var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
        var bdate = moment(fields.offer_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
        
        var quirydate = moment(fields.query_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
        db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
                    var no = (maxno[0].no + 1).toString().padStart(5, '0');
        var otcl = JSON.parse(fields.otc);
        var saf = JSON.parse(fields.saf);
        var docname = '';
        console.log("sagent "+fields.sales_agent);
          if (typeof (files.offer_summary_doc) != 'undefined' ){
              docname = ctime + files.offer_summary_doc.name;
           }
           if(fields.imgid != 'undefined'){
           if (docname === '')
                docname = fields.ooffer_summary_doc;
            } 
        if (fields.ofrsmryid !== 'undefined') {
              console.log("docname "+docname);
              console.log("imgid "+fields.imgid);
              console.log(fields.otc);
            var pvar = {doc:docname};
            db.query.updateDb('offer', {offer_validity:fields.offer_validity,submit_status:'full',offer_note:fields.offer_note, offer_date: bdate,total_amount: fields.total_amount,total_quantity: fields.total_quantity,sales_agent:fields.sales_agent,tax:fields.tax,amount:fields.amount,modification_date: new Date().toMysqlFormat(),modified_by: req.session.user.id}, fields.ofrsmryid, function (pid) {
            if(fields.imgid == 'undefined'){
              db.query.insertDb('document', {doc:docname,ref_id:fields.ofrsmryid,doc_type:'offer'}, function (did) {});
            }else{
            db.query.updateDb('document', pvar, fields.imgid, function (uid) { });
                }
                db.query.deleteDb('offer_term_conditions', " offer=" + fields.ofrsmryid, function (cid) {});
                db.query.deleteDb('offer_aditional', " offer=" + fields.ofrsmryid, function (cid) {});
                insertSummaryTermsDetail(otcl, fields.ofrsmryid, req);
                insertAdditionalTaxDetail(saf,fields.ofrsmryid,req);
                generateLogFile({user: req.session.user.id, type: 'Offer Summary modification', time: new Date(), refer_id: fields.imgid});
          });
        }
        else{  
          db.query.insertDb('offer', {enquiry:fields.enquiry_id,company: req.session.user.cur_company,submit_status:'full',offer_no:fields.offer_no,autono:no, fyear: fyear, offer_note:fields.offer_note, customer: fields.customer, offer_date: bdate, offer_prepared_by:req.session.user.id,offer_validity:fields.offer_validity,total_amount: fields.total_amount,total_quantity: fields.total_quantity,sales_agent:fields.sales_agent,tax:fields.tax,amount:fields.amount,created_by: req.session.user.id}, function (pid) {
          db.query.updateDb('enquiry', {offer_status:'os', modification_date: new Date().toMysqlFormat()}, fields.enquiry_id, function (eid) {}); 
            db.query.insertDb('document', {doc:docname,ref_id:pid,doc_type:'offer'}, function (did) {
            insertSummaryTermsDetail(otcl, pid, req);
            insertAdditionalTaxDetail(saf,pid,req);
            generateLogFile({user: req.session.user.id, type: 'Offer Summary creation', time: new Date(), refer_id: pid});
            });
          });
            }
             res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
     });
  });
});
function insertspecialdetails(rb,pid,oiid,spclarr,req) {
  console.log("calling from insertspecialdetails");
  var subarr=[],sub='';
    Object.keys(spclarr).forEach(function (k) {
       sub = spclarr[k];
       subarr = sub.split(':');
            db.query.insertDb('offer_special_service', {offer: pid, offer_item: oiid,company:req.session.user.cur_company,special_service:subarr[0],sub_special_service:subarr[1]}, function (sid) {});
    });
}
function insertSalesDetail(rb, pid, bdate, req) {
  console.log("calling from insertSalesDetail");
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('offer_aditional', {offer: pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
    });
}
function insertUpdateSalesDetail(rb, pid, bdate, req) {
  console.log("calling from insertUpdateSalesDetail");
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.updateDbCustom('offer_aditional', {offer: pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx},"offer='"+pid+"' AND offer_additional='"+rb.saf[k].id+"'", function (sid) {});
        }
    });
}
function insertFinalSalesDetail(rb, pid, bdate, req) {
    Object.keys(rb.saf).forEach(function (k) {
      db.query.selectCustomDb("SELECT id,offer FROM offer_aditional WHERE  offer='" + pid + "' AND offer_additional='"+rb.saf[k].id+"' ", function (newAdd) {
        if(newAdd.length > 0){
          console.log("calling from insertFinalSalesAdditionalDetail update");
        if (rb.saf[k].v > 0) {
            db.query.updateDbCustom('offer_aditional', {offer: pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx},"offer='"+pid+"' AND offer_additional='"+rb.saf[k].id+"'", function (sid) {});
        }
      }else{
        console.log("calling from insertFinalSalesAdditionalDetail insert");
        if (rb.saf[k].v > 0) {
        db.query.insertDb('offer_aditional', {offer: pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
        }
      }
      });
    });
    Object.keys(rb.item).forEach(function (k) {
      db.query.selectCustomDb("SELECT id,offer FROM offer_item WHERE  offer='" + pid + "' AND item='"+rb.item[k].id+"' ", function (newitm) {
        
        var spcl = rb.item[k].spclsrvc;
        spclarr = [];
        spclarr = spcl.split(',');
        console.log(spclarr);

        if(newitm.length > 0){
          console.log("calling from insertFinalSalesItemDetail update");
            db.query.updateDbCustom('offer_item', {offer: pid, item: rb.item[k].id,quantity: rb.item[k].q,tax:rb.item[k].ts,tax_amount:rb.item[k].tx, unit: rb.item[k].u, rate: rb.item[k].p, discount: rb.item[k].d, final_amount: rb.item[k].t,description:rb.item[k].gnrldescription,pr_parts:rb.item[k].pr,trim_parts:rb.item[k].trim,stem:rb.item[k].stem,item_code:rb.item[k].itmcode,special_description:rb.item[k].spcldescription,hydraulic_body:rb.item[k].hydbody,hydraulic_seat:rb.item[k].hydseat,pneumatic_seat:rb.item[k].pneumseat,hydroback_seat:rb.item[k].hydbackseat,inspection:rb.item[k].inspection,standard:rb.item[k].standard,enq_serial_no:rb.item[k].enq_serial_no,discount_numeric:rb.item[k].discount_numeric},"item='"+rb.item[k].id+"' AND offer='"+pid+"' ", function (sid) {
            });
            db.query.deleteDb('offer_special_service', "offer='"+pid+"' AND offer_item='"+newitm[0].id+"'" , function (cid) {});
        insertspecialdetails(rb,pid,newitm[0].id,spclarr,req);
        }else{
          console.log("calling from insertFinalSalesItemDetail insert");
          db.query.insertDb('offer_item', {offer: pid, item: rb.item[k].id,quantity: rb.item[k].q,tax:rb.item[k].ts,tax_amount:rb.item[k].tx, unit: rb.item[k].u, rate: rb.item[k].p, discount: rb.item[k].d, final_amount: rb.item[k].t,description:rb.item[k].gnrldescription,pr_parts:rb.item[k].pr,trim_parts:rb.item[k].trim,stem:rb.item[k].stem,item_code:rb.item[k].itmcode,special_description:rb.item[k].spcldescription,hydraulic_body:rb.item[k].hydbody,hydraulic_seat:rb.item[k].hydseat,pneumatic_seat:rb.item[k].pneumseat,hydroback_seat:rb.item[k].hydbackseat,inspection:rb.item[k].inspection,standard:rb.item[k].standard,enq_serial_no:rb.item[k].enq_serial_no,discount_numeric:rb.item[k].discount_numeric}, function (sid) {
             db.query.deleteDb('offer_special_service', "offer='"+pid+"' AND offer_item='"+sid+"'" , function (cid) {});
             insertspecialdetails(rb,pid,sid,spclarr,req);
          });
        }
      });
    });
}
router.get('/mapping/:id', function (req, res) {
res.render('tmpl/offer/mappinglist.html',{oid:req.params.id});
});
router.post('/ajaxgetmappinglist/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getofferMappingVen({company: req.session.user.cur_company, status: 'active',id:req.params.id, val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                //var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Partial</a>';
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
                   action += '<a data-id="' + data[0][i].itmid + '" data-oid="' + data[0][i].id + '"  data-oiid="' + data[0][i].oiid + '" class="dropdown-item s-l-im" title="Item_mapping">Mapping</a>'
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
  var cid = req.query.oiid;
  var oiid = cid.replace(/"/g, "");

db.query.getMappingdetailsByItemId({code:itmid,oiid:oiid}, function (mapping) {    
  db.query.newMappingdetailsByItemId({oiid:oiid,oid:oid,itm:itmid}, function (newmapping) {
   // console.log(mapping);
  res.render('tmpl/offer/item_mapping.html',{mapping:mapping,offer:oid,newmapping:newmapping,ofritm:oiid});
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
    var prod='';
    Object.keys(rb.item).forEach(function (k) {
        if(rb.item[k].imapid != undefined){
          db.query.updateDbCustom('component_sub_mapping', {item:rb.item[k].id,offer:rb.ofr,offer_item:rb.ofritm,material:rb.item[k].prod,component_mapping:rb.item[k].cm},"id=" + rb.item[k].imapid ,function (compmap) {
              generateLogFile({user: req.session.user.id, type: 'mapping updating', time: new Date(), refer_id: compmap});
          });
          res.end(JSON.stringify({'code': 2, 'msg': 'Success'}));
        }
        else{
          db.query.insertDb('component_sub_mapping', {item:rb.item[k].id,offer:rb.ofr,offer_item:rb.ofritm,material:rb.item[k].prod,component_mapping:rb.item[k].cm,company:req.session.user.cur_company,created_by:req.session.user.id},function (compmap) {
            //db.query.updateDbCustom('offer_item', {item_mapping_status:'yes'},"offer='"+rb.ofr+"' AND item=" + rb.item[k].id,function(oitem){});
              generateLogFile({user: req.session.user.id, type: 'mapping creating', time: new Date(), refer_id: compmap});
          });
          res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
         }
        });
        //db.query.updateDbCustom('offer_item', {item_mapping_status:'yes'},"offer='"+rb.ofr+"' AND item=" +prod,function(oitem){});    
  });
function insertTermsDetail(rb, pid, req){
 console.log("calling from insertTermsDetail");
  Object.keys(rb.otc).forEach(function (k) {
     db.query.insertDb('offer_term_conditions', {offer: pid, offer_term_conditions: rb.otc[k].id, message: rb.otc[k].msg}, function (sid) {});
    });
}
function insertUpdateTermsDetail(rb, pid, req){
 console.log("calling from insertUpdateTermsDetail");
  Object.keys(rb.otc).forEach(function (k) {
     db.query.updateDbCustom('offer_term_conditions', {offer: pid, offer_term_conditions: rb.otc[k].id, message: rb.otc[k].msg},"offer='"+pid+"' AND offer_term_conditions='"+rb.otc[k].id+"' ", function (sid) {});
    });
}
function insertFinalTermsDetail(rb, pid, req){
 
  Object.keys(rb.otc).forEach(function (k) {
  db.query.selectCustomDb("SELECT id,offer FROM offer_term_conditions WHERE  offer='" + pid + "' AND offer_term_conditions='"+rb.otc[k].id+"' ", function (newotc) {
        if(newotc.length > 0){
          console.log("calling from insertFinalTermsDetail update");
     db.query.updateDbCustom('offer_term_conditions', {offer: pid, offer_term_conditions: rb.otc[k].id, message: rb.otc[k].msg},"offer='"+pid+"' AND offer_term_conditions='"+rb.otc[k].id+"' ", function (sid) {});
    }
    else{
      console.log("calling from insertFinalTermsDetail insert");
      db.query.insertDb('offer_term_conditions', {offer: pid, offer_term_conditions: rb.otc[k].id, message: rb.otc[k].msg}, function (sid) {});
    }
    });
});
}

function insertSummaryTermsDetail(fields, pid, req){
  Object.keys(fields).forEach(function (k) {
        db.query.insertDb('offer_term_conditions', {offer: pid, offer_term_conditions: fields[k].id, message: fields[k].msg}, function (sid) {});
    });
}
function insertAdditionalTaxDetail(fields, pid, req){
  Object.keys(fields).forEach(function (k) {
    if (fields[k].v > 0) {
            db.query.insertDb('offer_aditional', {offer: pid, offer_additional: fields[k].id, amount: fields[k].v,tax:fields[k].ts,tax_amount:fields[k].tx}, function (sid) {});
          }
    });
}
router.get('/getcodecombination/:id', function (req, res) {
    db.query.selectDb('sub_item', "status<>'delete' AND item='"+ req.params.id+"'", function (row) {
        console.log(row);
        res.end(JSON.stringify(row));
    });
});
router.get('/subproduct', function (req, res) {
  db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='subcodification' ORDER BY 'specification_no'" , function (specificcategory) {
    db.query.selectCustomDb("SELECT i.id,cmd.size_id FROM item i INNER JOIN component_mapping_details cmd ON i.id=cmd.item WHERE i.type='product' AND i.category='finished'", function (row) {
        res.render('tmpl/offer/sub_product.html',{row: row,specificcategory:specificcategory});
    });
  });
});
router.get('/product_list', function (req, res) {
        res.render('tmpl/offer/product_list.html');
});
router.post('/ajaxgetproduct', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
    };
    db.query.getprodilist({company:req.session.user.cur_company,type:'product',category:'finished',status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                   var action  = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       if(data[0][i].size_id != null){
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-subcode" title="sub_codification"> Sub Product </a>'
                       }
                       action += '</div>'
                       action += '</div>'
                       //console.log('size_id '+ data[0][i].size_id);
                    
                    arrObj.data.push([data[0][i].size_id,action]);
            }
           // console.log(arrObj);
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/sub_product/:id', function (req, res) {
  db.query.selectDb('component_mapping_details', "item='"+ req.params.id+"'", function (row) {
      if(row.length > 0){
    res.render('tmpl/offer/sub_product_list.html',{scid:req.params.id,row:row[0]});  
  }
});
});
router.post('/ajaxsubcodificationget/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getsubcodificationVen({item: req.params.id, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-subitm="'+ data[0][i].sub_item +'" data-itm="'+ data[0][i].item +'"  class="dropdown-item s-l-sce" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-subitm="'+ data[0][i].sub_item +'" data-itm="'+ data[0][i].item +'"  class="dropdown-item s-l-scd" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                    arrObj.data.push([data[0][i].code,data[0][i].specification,action]);
            }
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/getoldcode', function (req, res) {
          var pid = req.query.pid;
          var prodid = pid.replace(/"/g,"");
        var sql="SELECT pc.id,psi.name,psi.code,pc.prod_specification_item,pc.prod_specification_category FROM product_codification pc INNER JOIN prod_specification_item psi ON pc.prod_specification_item = psi.id where  pc.product_item_id ='"+prodid+"'";
           db.query.selectCustomDb(sql , function (itemcode) {    
           res.end(JSON.stringify(itemcode))
      });
});
router.get('/sub_product_new/:id', function (req, res) {
  db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='subcodification' ORDER BY 'specification_no'" , function (specificcategory) {
     res.render('tmpl/offer/sub_product_new.html',{specificcategory:specificcategory,itemid:req.params.id});
  });
});

router.get('/sub_product_edit/:id', function (req, res) {
  var subitm = req.params.id;
  console.log("editid "+subitm);
    db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='subcodification' ORDER BY 'specification_no'" , function (specificcategory) {
      db.query.selectDb('product_sub_codification', "status<>'delete' AND sub_item='"+ subitm+"'", function (row) {
        res.render('tmpl/offer/sub_product_edit.html', {row: row[0],specificcategory:specificcategory});
      });    
   }); 
});
router.get('/getsuboldcode', function (req, res) {
          var pid = req.query.pid;
          var prodid = pid.replace(/"/g,"");
        var sql="SELECT psc.id,psi.name,psi.code,psc.prod_specification_item,psc.prod_specification_category FROM product_sub_codification psc INNER JOIN prod_specification_item psi ON psc.prod_specification_item = psi.id where  psc.sub_item ='"+prodid+"'";
          db.query.selectCustomDb(sql , function (itemcode) {    
           res.end(JSON.stringify(itemcode))
      });
});
router.get('/getsubservicecode', function (req, res) {
          var pid = req.query.pid;
          var prodid = pid.replace(/"/g,"");
        var sql="SELECT * FROM offer_special_service  where  offer_item ='"+prodid+"'";
          console.log(sql);
          db.query.selectCustomDb(sql , function (itemcode) {    
           res.end(JSON.stringify(itemcode))
      });
});
router.get('/sub_product_delete', function (req, res) {
  var cid = req.query.id;
  var item = cid.replace(/"/g,"");
  var p_i_id = req.query.p_i_id;
  var subitm = p_i_id.replace(/"/g,"");
  db.query.deleteDb('sub_item',"id='"+subitm+"'", function (did) {
  db.query.deleteDb('product_sub_codification', "sub_item='"+subitm+"' AND item='"+item+"'", function (cid) {
     generateLogFile({user: req.session.user.id, type: 'sub product delete', time: new Date(), refer: did});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
      });
    });  
  });
router.post('/sub_product_save', function (req, res) {
    var rb = req.body;
      // console.log("prodid "+rb.prodid);  
     if (rb.subitmid != undefined) {
       console.log("update "+rb.subid+' '+rb.itmid);
       db.query.updateDb('sub_item', {item:rb.itmid,code:rb.code.trim(),specification:rb.product_specification.trim(),name:rb.product_name,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()},rb.subitmid, function (did) {
       db.query.deleteDb('product_sub_codification', "sub_item='"+rb.subitemid+"' AND item='"+rb.itmid+"'", function (cid) {
          Object.keys(rb.category).forEach(function (k) {
            db.query.insertDb('product_sub_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,item:rb.itmid,sub_item:rb.subitmid}, function (pid) {});
             generateLogFile({user: req.session.user.id, type: 'product sub codification modification', time: new Date(), refer_id: rb.subitmid});
             });
             res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
             });
           });
          }
          else{
                db.query.insertDb('sub_item', {company:req.session.user.cur_company,item:rb.itmid,code:rb.code.trim(),specification:rb.product_specification.trim(),name:rb.product_name,created_by:req.session.user.id}, function (did) {
                Object.keys(rb.category).forEach(function (k) {
                 db.query.insertDb('product_sub_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,item:rb.itmid,sub_item:did}, function (cid) {
                 generateLogFile({user: req.session.user.id, type: 'product sub codification creation', time: new Date(), refer_id: did});
                });
                 });
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
              });
          }

});
module.exports = router;