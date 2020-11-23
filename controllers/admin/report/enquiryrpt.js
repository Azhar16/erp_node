var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');


router.get('/enquirydetails', function (req, res) {
        db.query.selectDb('company', " status<>'delete'", function (comp) {
          db.query.selectCustomDb("SELECT cus.company_name,cus.id from enquiry e INNER JOIN customer cus ON cus.id = e.customer group by cus.name", function (cus) {  
        db.query.selectCustomDb("SELECT * from enquiry group by enquiry_status", function (status) {  
    res.render('tmpl/report/enquiry/enquirydetails.html',{comp:comp,cus:cus,status:status});
    });       
   });
  });
    });



router.post('/getenquirydetail', function (req, res) {
    var rb = req.body;
        console.log('cusname '+rb.cus_name);
        console.log('status '+rb.status);
      db.query.reportallenquiryDet( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),customer: rb.cus_name,status:rb.status}, function (row) {
        console.log(row);
        res.render('tmpl/report/enquiry/enquiryalldetailslist.html',{row:row,com:req.session.company,frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")});
    });
});



module.exports = router;