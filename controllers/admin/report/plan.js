var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path');


router.get('/planningsumdetail', function (req, res) {
    jsonfile.readFile('config/month.json', function (err, month) {
        db.query.selectDb('plan', " status<>'delete' AND company=" + req.session.user.cur_company, function (planno) {
    res.render('tmpl/report/plan/planing_summary.html',{month:month,planno:planno});
    });
  });
});

router.post('/getplan', function (req, res) {
    var rb = req.body;
    console.log("pmonth "+rb.plan_month);
    console.log("pyear "+rb.plan_year);
        //db.query.selectDb('plan', " status<>'delete' AND company=" + req.session.user.cur_company+" AND month="+rb.plan_month+ " AND year="+rb.plan_year, function (planno) {
        db.query.selectCustomDb("SELECT * FROM plan WHERE status<>'delete' AND company='"+req.session.user.cur_company+"' AND month='"+rb.plan_month+"' AND year='"+rb.plan_year+"' ", function (planno) {

            console.log("plan_no "+planno[0].plan_no);
    res.end(JSON.stringify(planno))

  });
});

router.post('/getplanningsumdetail', function (req, res) {
    var rb = req.body;
    db.query.reportplanningsummaryDet( {plan_year:rb.plan_year,plan_month:rb.plan_month}, function (row) {
        db.query.selectCustomDb("SELECT SUM(wi.planed) tot_qnty FROM plan_item pi INNER JOIN workorder_item wi ON pi.item = wi.item AND pi.workorder = wi.workorder INNER JOIN plan p ON pi.plan = p.id WHERE pi.status <>'delete' AND p.year ='"+rb.plan_year+"' AND p.month='"+rb.plan_month+"' AND p.plan_no='"+rb.plan_no+"' ", function (grnd_tot) {
       // console.log(row);
        var acc=[];
        var glblplan='';
        var glblwo='';
        var glblsubwo='';
        for(var k in row){
               glblplan = row[k].plan_no;
               glblwo = row[k].wo_no;
                if(row[k].plan_no  && !acc[glblplan]){
                acc[glblplan] = [];
                }
                if( !acc[glblplan][glblwo] && row[k].wo_no != '' && typeof row[k].wo_no != 'undefined'){
                    acc[glblplan][glblwo] = [];
                }
                acc[glblplan][glblwo].push({wono:glblwo,trim:row[k].trim,moc:row[k].moc,ends:row[k].ends,inspection:row[k].inspection,size_id:row[k].size_id,planed:row[k].planed,itmid:row[k].itmid,cus:row[k].cus,offer:row[k].offer_no,itmno:row[k].itmno,rate:row[k].rate,cdd:row[k].cdd,wodate:row[k].wo_date});
               
        }
        //console.log(acc);
        res.render('tmpl/report/plan/planningsummarylist.html',{row:row,com:req.session.company,grnd_tot:grnd_tot[0],acc:acc,month:rb.plan_month});
    });
  });
});

router.post('/getComp', function (req, res) {
    var rb = req.body;
        db.query.selectCustomDb("SELECT * FROM `product_feature` WHERE  status<>'delete' AND company='"+req.session.user.cur_company+"' ", function (compname) {
    res.end(JSON.stringify(compname))

  });
});

router.get('/componentdetail', function (req, res) {
    jsonfile.readFile('config/month.json', function (err, month) {
        db.query.selectDb('plan', " status<>'delete' AND company=" + req.session.user.cur_company, function (planno) {
            db.query.selectCustomDb("SELECT * FROM `product_feature` WHERE  status<>'delete' AND company='"+req.session.user.cur_company+"' ", function (compname) {
    res.render('tmpl/report/plan/componentdetails.html',{month:month,planno:planno,compname:compname});
    });
  });
 });
});

router.post('/getcomponentdetail', function (req, res) {
    var rb = req.body;
    db.query.selectCustomDb("SELECT * FROM `product_feature` WHERE  id='"+rb.comp_name+"' ", function (compname) {
    db.query.reportplancomponentDet({plan_year:rb.plan_year,plan_month:rb.plan_month,comp_name:rb.comp_name}, function (row) {
       
        res.render('tmpl/report/plan/componentdetailslist.html',{row:row,com:req.session.company,compname:compname[0],yr:rb.plan_year,month:rb.plan_month});
    //});
    });
  });
});



module.exports = router;