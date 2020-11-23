var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');
router.get('/depincometaxdetails', function (req, res) {
        db.query.selectCustomDb("SELECT * from asset WHERE status<>'delete'", function (asset) {  
    res.render('tmpl/report/asset/depincometax.html',{asset:asset});
 
  });
    });
router.post('/getdepincometaxdetail', function (req, res) {
    var rb = req.body;
    console.log("a "+rb.frm_date);
    var from_date ;
    if(rb.frm_date != ''){
     from_date = moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    }
    else{
        from_date = '';
    }
      db.query.reportalldepincomeDet( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),aname:rb.asset_name}, function (row) {
        res.render('tmpl/report/asset/depincometaxlist.html',{row:row,com:req.session.company,frm_date:from_date});
    });
});
router.get('/depcompanytaxdetails', function (req, res) {
        db.query.selectCustomDb("SELECT * from asset WHERE status<>'delete'", function (asset) {  
    res.render('tmpl/report/asset/depcompanytax.html',{asset:asset});
  })
    });
router.post('/getdepcompanytaxdetail', function (req, res) {
    var rb = req.body;
    console.log("a "+rb.frm_date);
    var from_date ;
    if(rb.frm_date != ''){
     from_date = moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    }
    else{
        from_date = '';
    }
      db.query.reportalldepcompanyDet( {frm_date:moment(rb.frm_date+' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss"),aname:rb.asset_name}, function (row) {
        res.render('tmpl/report/asset/depcompanytaxlist.html',{row:row,com:req.session.company,frm_date:from_date});
    });
});
router.get('/openings', function (req, res) {
       // db.query.selectCustomDb("SELECT * from asset WHERE status<>'delete'", function (asset) {  
    res.render('tmpl/report/asset/openings.html');
 
//  })
});
router.post('/getOpeningssdetail', function (req, res) {
    var rb = req.body;
    var constfyear = '1819';
    var fyear = getFYear(new Date());

    var conststartyear = constfyear.toString().substring(0,2);
    var constendyear = constfyear.toString().substring(2,4);

    var startyear = fyear.toString().substring(0,2);
    var endyear = fyear.toString().substring(2,4);

    var d = new Date();
    var n = d.getFullYear();
    var cyear = n.toString().substring(0,2);
    
      db.query.reportallOpeningsDet( {fyear:fyear}, function (row) {
       //console.log(row);
        res.render('tmpl/report/asset/openingslist.html',{row:row,com:req.session.company,conststartyear:conststartyear,constendyear:constendyear,cyear:cyear,method:rb.method_id,fyear:fyear,startyear:startyear,endyear:endyear,constfyear:constfyear});
    });
});
router.get('/addtionsdetails', function (req, res) {
 res.render('tmpl/report/asset/additions.html');
 });
router.post('/getAdditionsdetail', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());

    var startyear = fyear.toString().substring(0,2);
    var endyear = fyear.toString().substring(2,4);

    var d = new Date();
    var n = d.getFullYear();
    var cyear = n.toString().substring(0,2);

      db.query.reportallAdditionsDet( {fyear:fyear}, function (row) {
        res.render('tmpl/report/asset/additionlist.html',{row:row,com:req.session.company,startyear:startyear,endyear:endyear,cyear:cyear,method:rb.method_id});
    });
});



module.exports = router;