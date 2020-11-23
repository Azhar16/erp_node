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

        res.render('tmpl/enquiry/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getEnquiryVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
               // var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                if (data[0][i].enquiry_status == 'pending') {
                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                   /*var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="status_change"> Status Change </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> Delete </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> Edit </button></li>'
                       action +='</ul>'
                       action +='</div>'*/
                       
                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-cp" title="change_permission">Change Permission</a>'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-sc" title="status_change">Status Change</a>'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-e" title="Edit">Edit</a>'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-d" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'


                   // action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                } else if (data[0][i].enquiry_status == 'accepted'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                       /*action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle btn-success" type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> Delete </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> Edit </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-success" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-cp" title="change_permission">Change Permission</a>'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-e" title="Delete">Edit</a>'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-d" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                        //action = '</button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i>';
                       /*action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle btn-danger" type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> Delete </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-danger" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" class="dropdown-item s-l-d" title="Delete">Delete</a>'
                       action += '</div>'
                       action += '</div>'

                     }
                    arrObj.data.push([data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>',data[0][i].enquiry_no ,data[0][i].enquiry_validity , pstatus, action]);
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.post('/approvedEnquiry', function (req, res) {
    var rb = req.body;
    console.log('acceptenqueryid '+rb.acceptenqueryid);
var pvar = {enquiry_status:'accepted'};
            db.query.updateDb('enquiry', pvar, rb.acceptenqueryid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'enquiry',item_id:rb.acceptenqueryid,status_tag:'accepted',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'enquiry status acctepted', time: new Date(), refer_id: rb.acceptenqueryid});
              });
            });
    res.send({'code': '1', 'msg': 'Success'});
});
router.post('/rejectEnquiry', function (req, res) {
    var rb = req.body;
    console.log('acceptenqueryid '+rb.acceptenqueryid);
var pvar = {enquiry_status:'rejected'};
            db.query.updateDb('enquiry', pvar, rb.acceptenqueryid, function (uid) {
                db.query.insertDb('status_message', {company:req.session.user.cur_company,type:'enquiry',item_id:rb.acceptenqueryid,status_tag:'rejected',status_msg:rb.remarks,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'enquiry status rejected', time: new Date(), refer_id: rb.acceptenqueryid});
              });
            });
    res.send({'code': '1', 'msg': 'Success'});
});

router.post('/enquirypermission', function (req, res) {
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('user_logo_path');
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {

        var docname = '';

          if (typeof (files.change_doc) != 'undefined' ){
              docname = ctime + files.change_doc.name;

           }
           console.log("epid "+fields.ep_id);

                db.query.insertDb('change_permission_tbl', {company:req.session.user.cur_company,type:'enquiry',item_id:fields.ep_id,note:fields.remarks,doc:docname,created_by: req.session.user.id}, function (pid) {
                generateLogFile({user: req.session.user.id, type: 'enquiry permission for change', time: new Date(), refer_id: fields.ep_id});
              });

    res.send({'code': '1', 'msg': 'Success'});
    });
});

router.get('/new', function (req, res) {
    var fyear = getFYear(new Date());
    jsonfile.readFile('config/default.json', function (err, currency) {
        db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
         db.query.selectCustomDb("SELECT MAX(auto_no) no FROM enquiry WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
          db.query.selectDb('sales_agent', " company=" + req.session.user.cur_company + "  AND status='active' ", function (sa) {

            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var enquiryno = (set[0].enquiry_pre == 'AI') ? no : ((set[0].enquiry_pre == 'FYEAR') ? fyear : set[0].enquiry_pre);
                    enquiryno += (set[0].enquiry_pre != '') ? set[0].enquiry_div : '';
                    enquiryno += (set[0].enquiry_cen == 'AI') ? no : ((set[0].enquiry_cen == 'FYEAR') ? fyear : set[0].enquiry_cen);
                    enquiryno += (set[0].enquiry_cen != '') ? set[0].enquiry_div : '';
                    enquiryno += (set[0].enquiry_su == 'AI') ? no : ((set[0].enquiry_su == 'FYEAR') ? fyear : set[0].enquiry_su);
                    //console.log('enquiryno '+enquiryno);
                    res.render('tmpl/enquiry/new.html',{enquiryno:enquiryno,sa:sa,currency:currency,payment_terms: config.get('payment_terms')});
          });
        });
      });
    });
        
});

router.get('/edit/:id', function (req, res) {
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.getEnquiryEdit({id: req.params.id, company: req.session.user.cur_company}, function (row) {
        console.log(row);
        res.render('tmpl/enquiry/edit.html',{payment_terms: config.get('payment_terms'),currency:currency,row: row, comstate: req.session.company.state});
    });
});
});

router.get('/delete/:id', function (req, res) {
    db.query.selectDb('enquiry', " id=" + req.params.id, function (sl) {
        db.query.deleteDb('enquiry', " id=" + req.params.id, function (cid) {
            generateLogFile({user: req.session.user.id, type: 'enquiry delete', time: new Date(), refer: sl});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        });
              
});


router.post('/save', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());
    var quirydate = moment(rb.query_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    var bid_opening_date = moment(rb.bid_opening_date + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");

    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
         db.query.selectCustomDb("SELECT MAX(auto_no) no FROM enquiry WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {

            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var enquiryno = (set[0].enquiry_pre == 'AI') ? no : ((set[0].enquiry_pre == 'FYEAR') ? fyear : set[0].enquiry_pre);
                    enquiryno += (set[0].enquiry_pre != '') ? set[0].enquiry_div : '';
                    enquiryno += (set[0].enquiry_cen == 'AI') ? no : ((set[0].enquiry_cen == 'FYEAR') ? fyear : set[0].enquiry_cen);
                    enquiryno += (set[0].enquiry_cen != '') ? set[0].enquiry_div : '';
                    enquiryno += (set[0].enquiry_su == 'AI') ? no : ((set[0].enquiry_su == 'FYEAR') ? fyear : set[0].enquiry_su);


 if (typeof rb.eid !== 'undefined') {
                db.query.updateDb('enquiry', {enquiry_no:enquiryno,fyear:fyear,customer: rb.customer,shipping:rb.shipping,sales_agent:rb.salesagent,ref_no: rb.ref_no,bank_guaranty:rb.bank_guarnty,bank_guaranty_percentage:rb.bank_guarnty_percentage, query_date: quirydate,bid_opening_date:bid_opening_date,enquiry_validity:rb.enquery_validity,currency:rb.currency,earn_money:rb.earn_money,amount:rb.amount,project_name:rb.project_name,project_no:rb.project_no,category:rb.category, created_by: req.session.user.id, modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.eid, function (eid) {
                    generateLogFile({user: req.session.user.id, type: 'enquiry modification', time: new Date(), refer_id: rb.eid});
                    res.end(JSON.stringify({'code': rb.eid, 'msg': 'Success'}));
                });
            }

else{
    db.query.insertDb('enquiry', {auto_no:no,enquiry_no:rb.enquiry_no,fyear:fyear,customer: rb.customer,shipping:rb.shipping,sales_agent:rb.salesagent,company: req.session.user.cur_company,ref_no: rb.ref_no,bank_guaranty:rb.bank_guarnty,bank_guaranty_percentage:rb.bank_guarnty_percentage, query_date: quirydate,bid_opening_date:bid_opening_date,enquiry_validity:rb.enquery_validity,currency:rb.currency,earn_money:rb.earn_money,amount:rb.amount,project_name:rb.project_name,project_no:rb.project_no,category:rb.category, created_by: req.session.user.id, modify_by: req.session.user.id}, function (pid) {
  //  insertSalesDetail(rb, pid, bdate, req);
       generateLogFile({user: req.session.user.id, type: 'enquiry creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
});
     });
});

/*router.get('/newoffer/:id', function (req, res) {
    console.log(req.params.id);
    var fyear = getFYear(new Date());
    jsonfile.readFile('config/default.json', function (err, currency) {
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
        db.query.selectCustomDb("SELECT MAX(autono) no FROM offer WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            db.query.selectDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (sa) {
                db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {
                    //console.log("sa "+sa.id);
                    var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var offerno = (set[0].sales_offer_pre == 'AI') ? no : ((set[0].sales_offer_pre == 'FYEAR') ? fyear : set[0].sales_offer_pre);
                    offerno += (set[0].sales_offer_pre != '') ? set[0].sales_offer_div : '';
                    offerno += (set[0].sales_offer_cen == 'AI') ? no : ((set[0].sales_offer_cen == 'FYEAR') ? fyear : set[0].sales_offer_cen);
                    offerno += (set[0].sales_offer_cen != '') ? set[0].sales_offer_div : '';
                    offerno += (set[0].sales_offer_su == 'AI') ? no : ((set[0].sales_offer_su == 'FYEAR') ? fyear : set[0].sales_offer_su);
                    console.log(offerno);
                    var amendmentno = (maxno[0].no + 1).toString().padStart(5,'0');
                    res.render('tmpl/offer/new.html', {currency:currency,payment_terms: config.get('payment_terms'), su: su, sa: sa, comstate: req.session.company.state, offerno: offerno,amendmentno:amendmentno ,set: set[0],tax_slab: config.get('tax_slab'),user:req.session.user.name,eid:req.params.id});
                 });
            });
          });
        });
    });
});*/



module.exports = router;