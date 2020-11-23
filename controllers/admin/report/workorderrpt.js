var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');


router.get('/workorderdetails', function (req, res) {
          db.query.selectCustomDb("SELECT * from workorder group by wo_status", function (status) {  
    res.render('tmpl/report/workorder/workorderdetails.html',{status:status});
    });       
    });



router.post('/getwodetail', function (req, res) {
    
    var rb = req.body;
    if(rb.wo_status == ''){
      db.query.reportallwoDate( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")}, function (row) {
        res.render('tmpl/report/workorder/workorderdetailslist.html',{row:row,com:req.session.company,frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")});
    }); 
    }
    else{
        db.query.reportwobystatusDate( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),wo_status:rb.wo_status}, function (row) {
        res.render('tmpl/report/workorder/workorderdetailslist.html',{row:row,com:req.session.company,frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")});
    });
   }
});



module.exports = router;