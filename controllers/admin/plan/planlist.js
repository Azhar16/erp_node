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
    res.render('tmpl/plan/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getPlanVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                var action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;';
                if (data[0][i].plan_status == 'pending') {
                    pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="monthlyplan_sheet"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                     var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-sc" title="monthlyplan_sheet"> Monthly Plan Sheet </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                } else if (data[0][i].plan_status == 'accepted'){
                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                     //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v" title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-v" title="View"> View </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-sc" title="monthlyplan_sheet"> Monthly Plan Sheet </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     }
                     else{
                        pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">Rejected</a>';
                       // action = '</button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     }
                    arrObj.data.push([data[0][i].plan_no , data[0][i].period_begin, data[0][i].period_end , data[0][i].month , data[0][i].year, pstatus, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.get('/new', function (req, res) {
    var fyear = getFYear(new Date());
    jsonfile.readFile('config/month.json', function (err, month) {
        db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (set) {
         db.query.selectCustomDb("SELECT MAX(autono) no FROM plan WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {
            var no = (maxno[0].no + 1).toString().padStart(5, '0');
                    var planno = (set[0].plan_pre == 'AI') ? no : ((set[0].plan_pre == 'FYEAR') ? fyear : set[0].plan_pre);
                    planno += (set[0].plan_pre != '') ? set[0].plan_div : '';
                    planno += (set[0].plan_cen == 'AI') ? no : ((set[0].plan_cen == 'FYEAR') ? fyear : set[0].plan_cen);
                    planno += (set[0].plan_cen != '') ? set[0].plan_div : '';
                    planno += (set[0].plan_su == 'AI') ? no : ((set[0].plan_su == 'FYEAR') ? fyear : set[0].plan_su);
                    //console.log('planno '+planno);
                    res.render('tmpl/plan/new.html',{planno:planno,month:month});
            });
        });
    });     
});
router.get('/edit/:id', function (req, res) {
    console.log(req.params.id);
    jsonfile.readFile('config/month.json', function (err, month) {
   db.query.selectDb('plan', "status <> 'delete' AND id=" + req.params.id, function (row) {
        console.log(row);
        res.render('tmpl/plan/edit.html',{month:month,row: row[0]});
    });
});
});

router.get('/delete/:id', function (req, res) {
    var sql = "SELECT p.id,pi.item,pi.workorder,pi.plan_quantity,wi.planed,wi.balanced FROM `plan` p INNER JOIN plan_item pi on p.id = pi.plan INNER JOIN workorder_item wi ON pi.workorder = wi.workorder AND pi.item = wi.item   WHERE p.id ="+req.params.id;
    db.query.selectCustomDb(sql, function (delpln) {
        for(var k in delpln){
            console.log("del "+delpln[k].plan_quantity);
            var finalplaned = (delpln[k].planed - delpln[k].plan_quantity);
            var finalbalance = parseInt(delpln[k].balanced) + parseInt(delpln[k].plan_quantity);
            console.log("finalplaned "+finalplaned);
            console.log("finalbalance "+finalbalance);
            db.query.updateDbCustom('plan_item', {status:"delete",modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, " workorder="+delpln[k].workorder+" AND item="+delpln[k].item+" AND plan="+req.params.id , function (planitmdelid) {});
                db.query.updateDbCustom('workorder_item', {planed:finalplaned,balanced:finalbalance}, " workorder="+delpln[k].workorder+" AND item="+delpln[k].item, function (eid) {});
        }
    db.query.selectDb('plan', "status <> 'delete' AND id=" + req.params.id, function (sl) {
        db.query.updateDb('plan', {status:'delete',modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (eid) {
            generateLogFile({user: req.session.user.id, type: 'plan delete', time: new Date(), refer: req.para.id});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        });
    });
              
});
router.get('/monthlyplansheet/:id', function (req, res) {
    var sql = "SELECT pi.id,pi.plan,pi.item,pi.plan_quantity,pi.workorder,pi.plan_item_id,pi.quantity,wo.wo_no,wi.balanced,wi.planed FROM `plan_item` pi INNER JOIN `workorder` wo  on pi.workorder=wo.id INNER JOIN workorder_item wi ON pi.item = wi.item AND pi.workorder = wi.workorder  WHERE pi.status<>'delete' AND pi.plan="+req.params.id;
        db.query.selectCustomDb(sql, function (planitm) {
           res.render('tmpl/plan/monthlyplansheet.html',{planid:req.params.id,planitm:planitm});         
         });        
});
/*router.get('/getplanhistory/:id', function (req, res) {
 var sql = "SELECT pi.id,pi.plan_item_id,pi.quantity,wo.wo_no FROM `plan_item` pi INNER JOIN `workorder` wo  on pi.workorder=wo.id  WHERE pi.status<>'delete' AND pi.plan="+req.params.id;
        db.query.selectCustomDb(sql, function (planitm) {
            console.log("plann "+planitm[0].quantity);
      res.end(JSON.stringify(row))

 });
});*/

router.post('/ajaxmonthsheet', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getMonthlyPlansheetVen({company: req.session.user.cur_company, wo_status: 'accepted', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var no = 10;
                var balanced = (data[0][i].quantity - data[0][i].planed);
                var plan_checkbox = '<input type="checkbox" data-bal="'+balanced+'" data-pid="'+(i+1)+'" data-trowid="'+data[0][i].wiid+'" data-id="'+data[0][i].id+'" data-planed="'+data[0][i].planed+'"  data-oqnty="'+data[0][i].quantity+'"  data-wo="'+data[0][i].wo_no+'" data-item="'+data[0][i].item+'"  name="monthlyplansheet_selected" class="monthlyplansheet-cls" style="cursor: pointer;">';
                if(balanced != 0){
                    arrObj.data.push([plan_checkbox,(i+1),data[0][i].wo_no ,data[0][i].name + '<br/><span style="font-size: 11px;">' + data[0][i].company_name + '</span>', data[0][i].size_id, data[0][i].moc, data[0][i].trim, data[0][i].ends , data[0][i].cdd , data[0][i].quantity,data[0][i].planed,balanced]);
              }            
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});
router.post('/save', function (req, res) {
    var rb = req.body;
    var fyear = getFYear(new Date());

    db.query.selectCustomDb("SELECT MAX(autono) no FROM plan WHERE company=" + req.session.user.cur_company + " AND fyear='" + fyear + "' ", function (maxno) {

            var no = (maxno[0].no + 1).toString().padStart(5, '0');

 if (typeof rb.planid !== 'undefined') {
                db.query.updateDb('plan', {plan_no:rb.plan_no,period_begin:rb.period_begin,period_end:rb.period_end,month:rb.plan_month,year:rb.plan_year,preference:rb.preference, modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()}, rb.planid, function (eid) {
                    generateLogFile({user: req.session.user.id, type: 'plan modification', time: new Date(), refer_id: rb.planid});
                    res.end(JSON.stringify({'code': rb.planid, 'msg': 'Success'}));
                });
            }

else{
    db.query.insertDb('plan', {autono:no,company:req.session.user.cur_company,plan_no:rb.plan_no,fyear:fyear,period_begin:rb.period_begin,period_end:rb.period_end,month:rb.plan_month,year:rb.plan_year,preference:rb.preference, created_by: req.session.user.id}, function (pid) {
       generateLogFile({user: req.session.user.id, type: 'plan creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
  });
});
router.post('/monthlyplansheetsave', function (req, res) {
    var rb = req.body;
           
       Object.keys(rb.item).forEach(function (k) {
            console.log("aaa");
            //db.query.selectDb('plan_item', "status <> 'delete' AND plan=" + rb.pid+ "  AND workorder="+rb.item[k].woid+" AND item="+rb.item[k].pitem, function (planit) {
            //console.log("plti "+planit[0].id);
        if(rb.item[k].balance >= rb.item[k].qnty){
            db.query.selectDb('plan_item', "status <> 'delete' AND plan=" + rb.pid+ "  AND workorder="+rb.item[k].woid+" AND item="+rb.item[k].pitem, function (planit) {
            if(typeof planit[0] != 'undefined'){
                console.log(typeof planit);
                console.log("eee");
                var plan_add_qnty = parseInt(rb.item[k].qnty) + parseInt(planit[0].plan_quantity);
            console.log("finalqnty "+rb.item[k].finalqnty)
                 db.query.deleteDb('plan_item', " plan=" + rb.item[k].planid+ " AND workorder="+rb.item[k].woid+" AND item="+rb.item[k].pitem, function (cid) {
                 db.query.updateDbCustom('workorder_item', {planed:rb.item[k].finalqnty,balanced:rb.item[k].finalbal}, " workorder="+rb.item[k].woid+" AND item="+rb.item[k].pitem, function (eid) {});
                 db.query.insertDb('plan_item', {plan:rb.item[k].planid,workorder:rb.item[k].woid,item:rb.item[k].pitem,plan_item_id:rb.item[k].plan_item_id,quantity:rb.item[k].finalqnty,plan_quantity:plan_add_qnty,created_by:req.session.user.id}, function (did) {});
                    generateLogFile({user: req.session.user.id, type: 'monthlyplansheet create', time: new Date()});
                    res.end(JSON.stringify({'code': "1", 'msg': 'Success'}));
                    });
             }else{
                   db.query.deleteDb('plan_item', " plan=" + rb.item[k].planid+ " AND workorder="+rb.item[k].woid+" AND item="+rb.item[k].pitem, function (cid) {
                 db.query.updateDbCustom('workorder_item', {planed:rb.item[k].finalqnty,balanced:rb.item[k].finalbal}, " workorder="+rb.item[k].woid+" AND item="+rb.item[k].pitem, function (eid) {});
                 db.query.insertDb('plan_item', {plan:rb.item[k].planid,workorder:rb.item[k].woid,item:rb.item[k].pitem,plan_item_id:rb.item[k].plan_item_id,quantity:rb.item[k].finalqnty,plan_quantity:rb.item[k].qnty,created_by:req.session.user.id}, function (did) {});
                    generateLogFile({user: req.session.user.id, type: 'monthlyplansheet create', time: new Date()});
                    res.end(JSON.stringify({'code': "2", 'msg': 'Success'}));
                    });
             }
              });
                    }
                    else{
                        res.end(JSON.stringify({'code': "3", 'msg': 'Error'}));
                    }
                      });
                  //});

   



});
router.post('/monthlyplansheetdelete', function (req, res) { 
        var rb = req.body;

        var balance = rb.balance;
        var planed = rb.planed;
        var plnqnty = rb.newplan_qnty;
        var fnlbalance = parseInt(balance) + parseInt(plnqnty);
        var fnlplaned = (planed - plnqnty);
        console.log("planed "+planed);
        console.log("plnqnty "+plnqnty);
        console.log("fnlplaned "+fnlplaned);

        db.query.updateDbCustom('plan_item', {status:'delete',modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, " id=" + rb.id, function (eid) {
            db.query.updateDbCustom('workorder_item', {planed:fnlplaned,balanced:fnlbalance}, " workorder="+rb.woid+" AND item="+rb.pitem, function (pid) {});
            generateLogFile({user: req.session.user.id, type: 'monthlyplansheet delete', time: new Date()});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
              
});
router.post('/monthlyplansheetedit', function (req, res) {
        var rb = req.body;
        console.log("add "+rb.finalbal);
        var oqnty = rb.oqnty;
        var pbalance = rb.balance;
        var finalbal = parseInt(oqnty) + parseInt(pbalance);
        console.log("pp1 "+oqnty);
        console.log("pp2 "+pbalance);
        console.log("pp3 "+finalbal);
        if(rb.newplan_qnty <= finalbal){
            if(rb.newplan_qnty < rb.oqnty){
                var new_planed = (rb.planed - (rb.oqnty - rb.newplan_qnty));
                var balanced = parseInt(rb.balance)+parseInt(rb.oqnty-rb.newplan_qnty);
            db.query.updateDbCustom('plan_item', {plan_quantity:rb.newplan_qnty,modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, " id=" + rb.id, function (eid) {
            db.query.updateDbCustom('workorder_item', {planed:new_planed,balanced:balanced}, " workorder="+rb.woid+" AND item="+rb.pitem, function (pid) {});
            generateLogFile({user: req.session.user.id, type: 'monthlyplansheet modification', time: new Date()});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        }else{
            var pqn = (rb.newplan_qnty - rb.oqnty);
            var new_planed_add = parseInt(rb.planed) + parseInt(pqn);
            var balanced_add = rb.balance - pqn;
            db.query.updateDbCustom('plan_item', {plan_quantity:rb.newplan_qnty,modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, " id=" + rb.id, function (eid) {
            db.query.updateDbCustom('workorder_item', {planed:new_planed_add,balanced:balanced_add}, " workorder="+rb.woid+" AND item="+rb.pitem, function (pid) {});
            generateLogFile({user: req.session.user.id, type: 'monthlyplansheet modification', time: new Date()});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                });
        }
    }else{
         res.end(JSON.stringify({'code': '2', 'msg': 'Error'}));
    }
              
});




module.exports = router;