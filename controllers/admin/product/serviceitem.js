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
        res.render('tmpl/service_item/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
          
    db.query.getserviceitemVen({company:req.session.user.cur_company,type:'service',status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                
                   /*var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '"  data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '"  data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> Delete </button></li>'
                       //action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-rawitm userrole-cls" data-permission = "sales-workorder-edit" title="raw_item"> Item(Raw) </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].code ,data[0][i].name,data[0][i].specification, action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});
router.get('/new', function (req, res) {
    res.render('tmpl/service_item/new.html', {tax_slab: config.get('tax_slab')});
});
router.get('/edit/:id', function (req, res) {
    db.query.selectDb('item', " id=" + req.params.id, function (row) {
        
                res.render('tmpl/service_item/edit.html', {row: row[0], tax_slab: config.get('tax_slab')});

   });
});
router.get('/delete/:id', function (req, res) {
    db.query.updateDb('item', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'Service item delete', time: new Date(), refer_id: req.params.id});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });
});
router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.ckDuplicateCode({code: rb.code, id: rb.iid}, function (stat) {
        if (stat == true) {
            if (typeof rb.iid !== 'undefined') {
                db.query.updateDb('item', {name: rb.name, code: rb.code.trim(),type:'service', pgroup: rb.group, specification: rb.specification.trim(), hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.iid, function (iid) {
                    generateLogFile({user: req.session.user.id, type: 'Service item modification', time: new Date(), refer_id: rb.iid});
                });
            } else {
                db.query.insertDb('item', {company: req.session.user.cur_company, name: rb.name, pgroup: rb.group, specification: rb.specification.trim(),type:'service', code: rb.code.trim(), hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, created_by: req.session.user.id, modify_by: req.session.user.id}, function (iid) {
                    generateLogFile({user: req.session.user.id, type: 'Service item creation', time: new Date(), refer_id: iid});
                });
            }
            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
        } else {
            res.end(JSON.stringify({'code': '2', 'msg': 'Duplicate product code!!!'}));
        }
    });
});
module.exports = router;