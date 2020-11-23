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
    //db.query.getSalesVen({company: req.session.user.cur_company, status: 'active'}, function (row) {
        res.render('tmpl/offer/list.html');
   // });
});
router.post('/amendmentdoc', function (req, res) {
         var rb = req.body;
         console.log("rb "+rb.offer_date);
          console.log("rb "+rb.offer_no);
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
    db.query.getOfferVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
               // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Partial</a>';
               // var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-success m-b-5 s-l-wo" title="workorder"> <i class="fa fa-thumbs-o-up"></i> </button>';
                 
                 var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                // var action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                if (data[0][i].offer_status == 'pending' ) {

                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                   // action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i></button>';
                   var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" title="status_change"> Status Change </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> View </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'
                 } else if (data[0][i].offer_status == 'accepted'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                     action = '<div class="dropdown">'
                     action +='<button class="btn btn-primary dropdown-toggle btn-success" type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       //action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" title="status_change"> Status Change </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> View </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> Delete </button></li>'                      
                      // action +='<li style="color:red;"><a data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class=" s-l-e userrole-cls" title="Edit">Edit</a></li>'
                       action +='</ul>'
                       action +='</div>'
                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                        //action = '<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                        action = '<div class="dropdown">'
                        action +='<button class="btn btn-primary dropdown-toggle btn-danger" type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                        action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       //action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-status_change" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc userrole-cls" title="status_change"> Status Change </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v userrole-cls" title="View"> View </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e userrole-cls" title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d userrole-cls" title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'
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
                var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>';
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
    db.query.selectCustomDb("SELECT c.* FROM enquiry e INNER JOIN customer c ON e.customer = c.id WHERE e.id ="+req.params.id, function (cusname) {
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
        db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            db.query.selectDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
                db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {
                    db.query.selectDb('enquiry', "id="+req.params.id, function (enqry) {
                    console.log("sa "+sa.id);
                    var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var offerno = (set[0].sales_offer_pre == 'AI') ? no : ((set[0].sales_offer_pre == 'FYEAR') ? fyear : set[0].sales_offer_pre);
                    offerno += (set[0].sales_offer_pre != '') ? set[0].sales_offer_div : '';
                    offerno += (set[0].sales_offer_cen == 'AI') ? no : ((set[0].sales_offer_cen == 'FYEAR') ? fyear : set[0].sales_offer_cen);
                    offerno += (set[0].sales_offer_cen != '') ? set[0].sales_offer_div : '';
                    offerno += (set[0].sales_offer_su == 'AI') ? no : ((set[0].sales_offer_su == 'FYEAR') ? fyear : set[0].sales_offer_su);
                    console.log(offerno);
                    var amendmentno = (maxno[0].no + 1).toString().padStart(5,'0');
             /* var amendmentno = (set[0].amendment_pre == 'AI') ? no : ((set[0].amendment_pre == 'FYEAR') ? fyear : set[0].amendment_pre);
                    amendmentno += (set[0].amendment_pre != '') ? set[0].amendment_div : '';
                    amendmentno += (set[0].amendment_cen == 'AI') ? no : ((set[0].amendment_cen == 'FYEAR') ? fyear : set[0].amendment_cen);
                    amendmentno += (set[0].amendment_cen != '') ? set[0].amendment_div : '';
                    amendmentno += (set[0].amendment_su == 'AI') ? no : ((set[0].amendment_su == 'FYEAR') ? fyear : set[0].amendment_su);*/
                    res.render('tmpl/offer/new.html', {currency:currency,payment_terms: config.get('payment_terms'), su: su, sa: sa, comstate: req.session.company.state, offerno: offerno,amendmentno:amendmentno ,set: set[0],tax_slab: config.get('tax_slab'),user:req.session.user.name,enquiryid:req.params.id,cusname:cusname[0]});
                 });
                });
            });
          });
        });
    });
  });
});
router.get('/edit/:id', function (req, res) {
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.getOfferEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        console.log(row);
        res.render('tmpl/offer/edit.html',{payment_terms: config.get('payment_terms'),currency:currency,row: row, comstate: req.session.company.state,tax_slab: config.get('tax_slab')});
    });
});
});
router.get('/delete/:id', function (req, res) {
    db.query.selectDb('offer', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('offer', " id=" + req.params.id, function (cid) {
            db.query.deleteDb('offer_item', " offer=" + req.params.id, function (cid) {
                db.query.deleteDb('offer_additional', " offer=" + req.params.id, function (cid) {
                    db.query.deleteDb('tax_tran', " type='offer' AND tran_id=" + req.params.id, function (cid) {
                        db.query.deleteDb('transaction_amount', " type='offer' AND ref_id=" + req.params.id, function (cid) {
                            generateLogFile({user: req.session.user.id, type: 'offer delete', time: new Date(), refer: sl});
                            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                    });
                });
            });
        });
    });
});



router.post('/save', function (req, res) {
    var rb = req.body;
    console.log("save "+rb.offer_no);
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
                db.query.insertDb('offer', {enquiry:rb.enquiry_id,company: req.session.user.cur_company,offer_no:offerno,autono:no, fyear: fyear, offer_term_note: rb.p_terms_note,offer_note:rb.offer_note, customer: rb.customer, offer_date: bdate, offer_prepared_by:req.session.user.id,offer_validity:rb.offer_validity,total_amount: rb.total_amount, created_by: req.session.user.id, modified_by: req.session.user.id}, function (pid) {
                   db.query.updateDb('enquiry', {offer:pid, modification_date: new Date().toMysqlFormat()}, rb.enquiry_id, function (eid) {}); 
                    insertSalesDetail(rb, pid, bdate, req);
                    generateLogFile({user: req.session.user.id, type: 'offer creation', time: new Date(), refer_id: pid});
                    res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));
                });

            });
        });
   // }

});
router.post('/amendmentsave', function (req, res) {
    var form = new formidable.IncomingForm();

    var rb1 = req.body;

    console.log("one "+req.session.amendment.offer_date);

    var ctime = new Date().getTime();
    form.uploadDir = config.get('user_logo_path');
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        console.log("feilds "+fields.did);
        console.log("abbbbb")

        var docname = '';
        console.log(files);

          if (typeof (files.amendment_doc) != 'undefined' ){
              docname = ctime + files.amendment_doc.name;
              console.log(docname);
           }

    
    var rb = req.session.amendment;
    var dt = rb.offer_date.split("/");
    var fyear = getFYear(new Date(dt[2] + "-" + dt[0] + "-" + dt[1]));
    var bdate = moment(rb.offer_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var quirydate = moment(rb.query_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var amendmentdate = moment(rb.amendment_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
       console.log("form "+rb.offer_no);
    
        db.query.updateDb('offer', {fyear: fyear,amendment_no:fields.amendmentno,offer_validity:rb.offer_validity, offer_term_note: rb.p_terms_note,offer_note:rb.offer_note, customer: rb.customer, offer_date: bdate,total_amount: rb.total_amount,amendment_date:new Date().toMysqlFormat(), modification_date: new Date().toMysqlFormat()}, rb.sid, function (pid) {
            db.query.insertDb('amendment_doc', {amendment_no:fields.amendmentno,a_doc:docname,offer_no:rb.offer_no,created_by:req.session.user.id}, function (did) {});
            db.query.deleteDb('offer_item', " offer=" + rb.sid, function (cid) {});
            db.query.deleteDb('offer_aditional', " offer=" + rb.sid, function (cid) {});
            db.query.deleteDb('transaction_amount', " type='offer' AND ref_id=" + rb.sid, function (cid) {});
            db.query.deleteDb('tax_tran', " type='offer' AND tran_id=" + rb.sid, function (cid) {});
            insertSalesDetail(rb, rb.sid, bdate, req);
            generateLogFile({user: req.session.user.id, type: 'offer modification', time: new Date(), refer_id: rb.sid});
            res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
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
                db.query.selectDb('bank', " id=" + req.session.company.default_bank, function (bank) {
                            db.query.getBillOfferDetail({sid: offer[0].id}, function (si) {
                                db.query.getBillOfferAdditional({sid: offer[0].id}, function (sa) {
                                    res.render('tmpl/offer/billbody.html', {com: req.session.company, offer: offer[0], si: si, sa: sa, bank: bank});
                                });
                            });
                        });
                    });
                
});

router.get('/enquerylist', function (req, res) {

                    res.render('tmpl/offer/enquirylist.html');

});

function insertSalesDetail(rb, pid, bdate, req) {
    Object.keys(rb.item).forEach(function (k) {
        db.query.insertDb('offer_item', {offer: pid, item: rb.item[k].id, quantity: rb.item[k].q, unit: rb.item[k].u, rate: rb.item[k].p, discount: rb.item[k].d,profit:rb.item[k].pft, final_amount: rb.item[k].t,tax:rb.item[k].ts,tax_amount:rb.item[k].tx}, function (sid) {});
    });
    Object.keys(rb.saf).forEach(function (k) {
        if (rb.saf[k].v > 0) {
            db.query.insertDb('offer_aditional', {offer: pid, offer_additional: rb.saf[k].id, amount: rb.saf[k].v,tax:rb.saf[k].ts,tax_amount:rb.saf[k].tx}, function (sid) {});
            db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: rb.saf[k].acc, amount: (rb.saf[k].v+rb.saf[k].tx)}, function (sid) {});
        }
    });
    db.query.insertDb('tax_tran', {tran_id: pid, creation_date: bdate, cgst: rb.cgst, sgst: rb.sgst, igst: rb.igst, type: 'offer'}, function (sid) {});
    if (rb.total_dis > 0) {
        db.query.selectDb('account', " code='DISCOUNT' AND company=" + req.session.user.cur_company, function (ac) {
            db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'de', type: 'offer', account: ac[0].id, amount: rb.total_dis}, function (sid) {});
        });
    }
    if (rb.cgst > 0) {
        db.query.selectDb('account', " code='5001' AND company=" + req.session.user.cur_company, function (ac) {
            db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: ac[0].id, amount: rb.cgst}, function (sid) {});
        });
    }
    if (rb.sgst > 0) {
        db.query.selectDb('account', " code='5002' AND company=" + req.session.user.cur_company, function (ac) {
            db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: ac[0].id, amount: rb.sgst}, function (sid) {});
        });
    }
    if (rb.igst > 0) {
        db.query.selectDb('account', " code='5003' AND company=" + req.session.user.cur_company, function (ac) {
            db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: ac[0].id, amount: rb.igst}, function (sid) {});
        });
    }
    if (rb.round != 0) {
        db.query.selectDb('account', " code='860' AND company=" + req.session.user.cur_company, function (ac) {
            if (rb.round > 0)
                db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: ac[0].id, amount: rb.round}, function (sid) {});
            else
                db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'de', type: 'offer', account: ac[0].id, amount: -rb.round}, function (sid) {});
        });
    }
    db.query.selectDb('account', " code='200' AND company=" + req.session.user.cur_company, function (ac) {
        db.query.insertDb('transaction_amount', {ref_id: pid, creation_date: bdate, amount_type: 'cr', type: 'offer', account: ac[0].id, amount: (rb.total_sub - rb.total_dis)}, function (sid) {});
    });
} 

module.exports = router;