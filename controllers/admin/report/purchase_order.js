var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');
router.get('/podetails', function (req, res) {
        db.query.selectDb('company', " status<>'delete'", function (comp) {
          db.query.selectCustomDb("SELECT cus.company_name,cus.id from purchase_order po INNER JOIN customer cus ON cus.id = po.vendor group by cus.name", function (cus) {  
        db.query.selectCustomDb("SELECT * from purchase_order group by po_status", function (status) {  
    res.render('tmpl/report/purchase_order/podetails.html',{comp:comp,cus:cus,status:status});
    });       
   });
  });
    });
router.post('/getpodetail', function (req, res) {
    var rb = req.body;
    console.log("frm_date "+moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"));
        if(rb.type == 'od'){
      db.query.reportallpoDet( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),customer: rb.cus_name,status:rb.status}, function (row) {
        res.render('tmpl/report/purchase_order/podetailslist.html',{row:row,com:req.session.company,frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")});
      });
        }
        if(rb.type == 'ad'){
        db.query.reportpoDetByItem({frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),customer: rb.cus_name,status:rb.status}, function (row) {
        //console.log(row);
        res.render('tmpl/report/purchase_order/podetailslistbyitem.html',{row:row,com:req.session.company,frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")});
      });
    }
});
router.get('/podetailwithindate', function (req, res) {
  db.query.selectCustomDb("SELECT * from purchase_order group by po_status", function (status) {  
    res.render('tmpl/report/purchase_order/pobydeliverdate.html',{status:status});
   });       
});
router.post('/getpodetailwithindate', function (req, res) {
    var rb = req.body;
    var cdate = new Date();
    var nday = rb.frm_date;
    //var ndate = getDateByDay(cdate,15);
    var ndate = '22/08/2019'
    console.log("ndate ",ndate);
    console.log("ccdate "+cdate);
    console.log("fdate "+moment(cdate+' 12:00:00').format("YYYY-MM-DD HH:mm:ss"));
    console.log("tdate "+moment(ndate+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"));
      db.query.reportallpoDetByDeliveryDate({fdate:moment(cdate+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),tdate:moment(ndate+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),status:rb.status}, function (row) {
        console.log(row);
        res.render('tmpl/report/purchase_order/pobydeliverdatelist.html',{row:row,com:req.session.company,nday:nday});
      });
});
module.exports = router;