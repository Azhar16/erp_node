var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');


router.get('/offerdetails', function (req, res) {
 
          db.query.selectCustomDb("SELECT cus.company_name,cus.id from offer o INNER JOIN customer cus ON cus.id = o.customer group by cus.name", function (cus) {  
    res.render('tmpl/report/offer/offerdetails.html',{cus:cus});
       
});
    });



router.post('/getofferdetail', function (req, res) {
    var rb = req.body;
    console.log('rb. '+moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"));
        db.query.reportofferDet( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")}, function (row) {
        res.render('tmpl/report/offer/offerdetailslist.html',{row:row,com:req.session.company,frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),to_date:moment(rb.to_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss")});
    });

});



module.exports = router;