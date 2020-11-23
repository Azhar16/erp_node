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
        res.render('tmpl/rawitem/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
          
    db.query.getrawitemVen({company:req.session.user.cur_company,type:'product',category:'raw',status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                
                   /*var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '"  data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> Edit </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '"  data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> Delete </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '"  class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-rim userrole-cls" data-permission = "sales-workorder-edit" title="rawitemmapping"> Mapping </button></li>'
                       //action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-rawitm userrole-cls" data-permission = "sales-workorder-edit" title="raw_item"> Item(Raw) </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-rim" title="rawitemmapping"> Mapping </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].code ,data[0][i].name,data[0][i].specification,data[0][i].unit, action]);
            }
            
        }
        res.end(JSON.stringify(arrObj));
  });
});
router.get('/new', function (req, res) {
    res.render('tmpl/rawitem/new.html', {tax_slab: config.get('tax_slab')});
});
router.get('/edit/:id', function (req, res) {
    db.query.selectDb('item', " id=" + req.params.id, function (row) {
        db.query.selectDb('item_stock', " type='open' AND item=" + row[0].id, function (os) {
            if(os.length>0){
                res.render('tmpl/rawitem/edit.html', {row: row[0], os: os[0], tax_slab: config.get('tax_slab')});
            }
            else{
                db.query.insertDb('item_stock', {item: row[0].id, type: 'open', quantity: 0, rate: 0, unit: row[0].unit}, function (oid) {});
                res.render('tmpl/rawitem/edit.html', {row: row[0], os: {quantity:0,rate:0}, tax_slab: config.get('tax_slab')});
            }
        });
    });
});
router.get('/delete/:id', function (req, res) {
    db.query.updateDb('item', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'item delete', time: new Date(), refer_id: req.params.id});
//        db.query.selectDb('item', " company=" + req.session.user.cur_company + "  AND status='active' ", function (row) {
//            res.render('tmpl/item/list.html', {row: row});
//        });
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });
});
router.get('/rawitemmapiing/:id', function (req, res) {
    db.query.selectDb('component_category_name', "product_type = 'raw' AND company=" + req.session.user.cur_company, function (row) {
       db.query.selectDb('item', " id=" + req.params.id, function (item) {
        db.query.selectDb('component_mapping', " item=" + req.params.id, function (itemmaping) {
            //db.query.selectDb('component_mapping_details', " item=" + req.params.id, function (compmap) {
               // var sql = "SELECT id,company,item,size,type,class,figure,ends,moc,size_id,trim,order_quantity,inspection,hydraulic_body,hydraulic_seat,pneumatic_seat,hydroback_seat,unit_rate,category,prod_feature,DATE_FORMAT(cdd,'%m/%d/%Y') cdd FROM `component_mapping_details` WHERE item=" + req.params.id;
                 ///   db.query.selectCustomDb(sql , function (compmap) { 
      res.render('tmpl/rawitem/rawitemmapping.html',{row:row,item:item[0],itemmaping:itemmaping});
        });
     });
   }); 

});

router.get('/getrawolditem/:id', function (req, res) {
       console.log(req.params.id);
        var sql="SELECT item.id,component_mapping.component,component_mapping.sub_component,component_mapping.prod_quantity,item.code FROM component_mapping INNER JOIN item ON component_mapping.product = item.id where component_mapping.item="+req.params.id;
    db.query.selectCustomDb(sql , function (itemmaping) {
     // console.log('imap '+itemmaping.code);      
      res.end(JSON.stringify(itemmaping))
        });
});

router.get('/getrawsubname/:id', function (req, res) {
  db.query.selectCustomDb("SELECT id,component_subname,component_category_name from component_category_subname WHERE component_category_name="+req.params.id, function (row) {
      res.end(JSON.stringify(row))

 });
});

router.get('/getrawprod/:txt', function (req, res) {
    
 var sql="SELECT * FROM item WHERE company=" + req.session.user.cur_company + "  AND category='raw' AND  ( code like '%" + req.params.txt + "%')  LIMIT 10";
    db.query.selectCustomDb(sql , function (item) {

      res.end(JSON.stringify(item));
     // res.render('tmpl/item/componentmapping.html',{prod:prod});

 });
});

router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.ckDuplicateCode({code: rb.code, id: rb.iid}, function (stat) {
        if (stat == true) {
            if (typeof rb.iid !== 'undefined') {
                db.query.updateDb('item', {name: rb.name, code: rb.code.trim(), pgroup: rb.group, specification: rb.specification.trim(), unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.iid, function (iid) {
                    db.query.updateDbCustom('item_stock', {quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, " type='open' AND item=" + rb.iid, function (sid) {});
                    generateLogFile({user: req.session.user.id, type: 'item modification', time: new Date(), refer_id: rb.iid});
                });
            } else {
                db.query.insertDb('item', {company: req.session.user.cur_company, name: rb.name, pgroup: rb.group, specification: rb.specification.trim(), category:'raw', code: rb.code.trim(), unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, created_by: req.session.user.id, modify_by: req.session.user.id}, function (iid) {
                    db.query.insertDb('item_stock', {item: iid, type: 'open', quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, function (oid) {});
                    generateLogFile({user: req.session.user.id, type: 'item creation', time: new Date(), refer_id: iid});
                });
            }
            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
        } else {
            res.end(JSON.stringify({'code': '2', 'msg': 'Duplicate product code!!!'}));
        }
    });


});

router.post('/rawitemmappingsave', function (req, res) {
    var rb = req.body;
 /* var product_cdd = moment(rb.product_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectDb('component_mapping_details', " item="+ rb.compmapid, function (row) {  
    if(typeof row[0] != 'undefined'){
      db.query.updateDbCustom('component_mapping_details', {size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, moc: rb.product_moc,cdd: product_cdd, trim: rb.product_trim,order_quantity: rb.product_qty, inspection: rb.product_inspection, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category,modify_by: req.session.user.id}, "item=" + rb.compmapid, function (sid) {});
    }
    else{
    db.query.insertDb('component_mapping_details', {item:rb.compmapid,company: req.session.user.cur_company,size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, moc: rb.product_moc,cdd: product_cdd, trim: rb.product_trim,order_quantity: rb.product_qty, inspection: rb.product_inspection, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category, created_by: req.session.user.id}, function (compmapdtl) {});
     }
     }); */
    Object.keys(rb.item).forEach(function (k) {
        db.query.deleteDb('component_mapping', " item=" + rb.compmapid, function (cmapdlt) {
        db.query.insertDb('component_mapping', {type:'raw',item:rb.compmapid,company: req.session.user.cur_company, component: rb.item[k].comp, sub_component: rb.item[k].sub_com, product: rb.item[k].prod, prod_quantity: rb.item[k].qnt, created_by: req.session.user.id, modify_by: req.session.user.id},function (compmap) {
                    generateLogFile({user: req.session.user.id, type: 'component mapping', time: new Date(), refer_id: compmap});
                });
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));

        });

    
    
  });

});



module.exports = router;