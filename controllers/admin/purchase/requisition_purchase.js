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
    res.render('tmpl/requisition_purchase/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getReqPurchaseVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                 var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                    
                   
                    //action = '<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc" title="monthlyplan_sheet"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d" title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e" title="Edit"> <i class="fa fa-wrench"></i> </button>';
                      /* if( data[0][i].plan_status == 'pending'){
                       pstatus = '<a class="btn btn-secondary btn-trans waves-effect w-md m-b-5">Pending</a>';
                    
                       action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-planid="' + data[0][i].planid + '" data-itemid="' + data[0][i].itemid + '" data-qnty="' + data[0][i].quantity + '" data-tqnty="' + data[0][i].current_stock + '" data-rawid="' + data[0][i].rawid + '" data-rawstock="' + data[0][i].cmqnty + '"     class="dropdown-item s-l-e" title="send"> Send </a>'
                       action += '</div>'
                       action += '</div>'
                       }
                       else{
                        pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Send</a>';
                        
                      }*/
                      /*var ab = i-1;
                      if(i>0){
                      if(data[0][i].planid == data[0][parseInt(ab)].planid){
                         data[0][i].plan_no = '';
                      }
                      if(data[0][i].itemid == data[0][parseInt(ab)].itemid){
                         data[0][i].code = '';
                         data[0][i].size_id = '';
                         data[0][i].quantity = '';
                         data[0][i].current_stock = '';
                      }
                    }*/
                    var action = '<a class="custom-modal-button" data-title="View Details" data-href="/purchase/requisition_purchase/details/'+data[0][i].rawitem+'" >Details</a>';
                     //var action = '<button data-id="' + data[0][i].rawitem + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 p-l-v custom-modal-button" title="View" > <i class="fa fa-eye"></i> </button>';
                      arrObj.data.push([data[0][i].code,data[0][i].date, data[0][i].tot,action ]);
                      
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});

router.post('/send', function (req, res) {
    var rb = req.body;
    Object.keys(rb.itm).forEach(function (k) {
      db.query.selectCustomDb("SELECT * FROM send_plan_list WHERE company=" + req.session.user.cur_company + " AND item='" + rb.itm[k].prod + "' AND rawitem='" + rb.itm[k].rawprod + "' AND plan='" + rb.itm[k].planid + "' ", function (spl) {
      if(spl.length > 0){
        var fnl = parseInt(spl[0].quantity)+parseInt(rb.itm[k].qnty);
        db.query.updateDb('send_plan_list', {quantity:fnl}, spl[0].id, function (pid) {
       });
      }
      else{
        db.query.insertDb('send_plan_list', {company:req.session.user.cur_company,plan:rb.itm[k].planid,item:rb.itm[k].prod,quantity:rb.itm[k].qnty,rawitem:rb.itm[k].rawprod}, function (pid) {
    });
      }
      
    });
  });
       generateLogFile({user: req.session.user.id, type: 'plan send', time: new Date()});
         res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));


});
router.get('/details/:itm', function (req, res) {
  db.query.getReqDetailsPurchaseVen({company: req.session.user.cur_company, rawitm: req.params.itm}, function (data) {
    res.render('tmpl/requisition_purchase/details.html',{itm:req.params.itm,data:data[0]});
  });
});
router.post('/ajaxdetailsget/:itm', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getReqDetailsPurchaseVen({company: req.session.user.cur_company, rawitm: req.params.itm, val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
              arrObj.data.push([data[0][i].id,data[0][i].plan_no,data[0][i].itemcode,data[0][i].rawitemcode,data[0][i].date, data[0][i].quantity ]);
                      
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});


module.exports = router;