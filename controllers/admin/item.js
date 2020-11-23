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
    res.render('tmpl/item/list.html');
});

router.get('/new', function (req, res) {
    res.render('tmpl/item/new.html', {tax_slab: config.get('tax_slab')});
});

router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.ckDuplicateCode({code: rb.code, id: rb.iid}, function (stat) {
        if (stat == true) {
            if (typeof rb.iid !== 'undefined') {
                db.query.updateDb('item', {name: rb.name, type: rb.type, category: rb.category, code: rb.code.trim(), pgroup: rb.group, specification: rb.specification, unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.iid, function (iid) {
                    db.query.updateDbCustom('item_stock', {quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, " type='open' AND item=" + rb.iid, function (sid) {});
                    generateLogFile({user: req.session.user.id, type: 'item modification', time: new Date(), refer_id: rb.iid});
                });
            } else {
                db.query.insertDb('item', {company: req.session.user.cur_company, name: rb.name, pgroup: rb.group, specification: rb.specification, type: rb.type, category: rb.category, code: rb.code.trim(), unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, created_by: req.session.user.id, modify_by: req.session.user.id}, function (iid) {
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

router.get('/edit/:id', function (req, res) {
    db.query.selectDb('item', " id=" + req.params.id, function (row) {
        db.query.selectDb('item_stock', " type='open' AND item=" + row[0].id, function (os) {
            if(os.length>0){
                res.render('tmpl/item/edit.html', {row: row[0], os: os[0], tax_slab: config.get('tax_slab')});
            }
            else{
                db.query.insertDb('item_stock', {item: row[0].id, type: 'open', quantity: 0, rate: 0, unit: row[0].unit}, function (oid) {});
                res.render('tmpl/item/edit.html', {row: row[0], os: {quantity:0,rate:0}, tax_slab: config.get('tax_slab')});
            }
        });
    });
});

router.get('/componentmaping/:id', function (req, res) {
    db.query.selectDb('component_category_name', " company=" + req.session.user.cur_company, function (row) {
       db.query.selectDb('item', " id=" + req.params.id, function (item) {
        db.query.selectDb('component_mapping', " item=" + req.params.id, function (itemmaping) {
            //db.query.selectDb('component_mapping_details', " item=" + req.params.id, function (compmap) {
                var sql = "SELECT id,company,item,size,type,class,figure,ends,moc,size_id,trim,order_quantity,inspection,hydraulic_body,hydraulic_seat,pneumatic_seat,hydroback_seat,unit_rate,category,prod_feature,DATE_FORMAT(cdd,'%m/%d/%Y') cdd FROM `component_mapping_details` WHERE item=" + req.params.id;
                    db.query.selectCustomDb(sql , function (compmap) {

                db.query.selectDb('component_features', " item=" + req.params.id, function (compftr) {
                
      res.render('tmpl/item/componentmapping.html',{row:row,item:item[0],compmap:compmap[0],itemmaping:itemmaping,compftr:compftr[0]});
  });
        });
     });
   }); 
 });
});

router.get('/getolditem/:id', function (req, res) {
       console.log(req.params.id);
        var sql="SELECT item.id,component_mapping.component,component_mapping.sub_component,component_mapping.prod_quantity,item.code FROM component_mapping INNER JOIN item ON component_mapping.product = item.id where component_mapping.item="+req.params.id;
    db.query.selectCustomDb(sql , function (itemmaping) {
     // console.log('imap '+itemmaping.code);      
      res.end(JSON.stringify(itemmaping))
        });
});

router.get('/getsubname/:id', function (req, res) {
  db.query.selectCustomDb("SELECT id,component_subname,component_category_name from component_category_subname WHERE component_category_name="+req.params.id, function (row) {
      res.end(JSON.stringify(row))

 });
});

router.get('/getprod/:txt', function (req, res) {
    
 var sql="SELECT * FROM item WHERE company=" + req.session.user.cur_company + "  AND category='finished' AND  ( code like '%" + req.params.txt + "%')  LIMIT 10";
    db.query.selectCustomDb(sql , function (item) {

      res.end(JSON.stringify(item));
     // res.render('tmpl/item/componentmapping.html',{prod:prod});

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

router.post('/ajaxget', function (req, res) {
    var rb=req.body;
    var sql ="SELECT * FROM `item` WHERE company=" + req.session.user.cur_company + " AND category='finished' AND status='active' AND (name like '%"+rb.search.value+"%' OR code LIKE '%"+rb.search.value+"%' OR specification LIKE '%"+rb.search.value+"%' OR hsn_code LIKE '%"+rb.search.value+"%' OR sales_rate LIKE '%"+rb.search.value+"%' OR purchase_rate LIKE '%"+rb.search.value+"%') LIMIT "+rb.start+","+rb.length;
    db.query.selectCustomDb(sql, function (row) {
        if(row.length>0){
            sql ="SELECT count(id) tot FROM `item` WHERE company=" + req.session.user.cur_company + " AND category='finished' AND status='active' AND (name like '%"+rb.search.value+"%' OR code LIKE '%"+rb.search.value+"%' OR specification LIKE '%"+rb.search.value+"%' OR hsn_code LIKE '%"+rb.search.value+"%' OR sales_rate LIKE '%"+rb.search.value+"%' OR purchase_rate LIKE '%"+rb.search.value+"%') ";
            db.query.selectCustomDb(sql, function (tot) {
                var arrObj={
                    "draw": rb.draw++,
                    "recordsTotal": tot[0].tot,
                    "recordsFiltered": tot[0].tot,
                    "data": []
                  };
                  for(var i=0;i<row.length;i++){
                      arrObj.data.push([row[i].name,row[i].code,row[i].unit,row[i].specification,'<button data-id="'+row[i].id+'" class="btn btn-icon waves-effect waves-light btn-view m-b-5 i-l-f"> <i class="fa fa-eye"></i> </button><button data-id="'+row[i].id+'" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 i-l-e"> <i class="fa fa-wrench"></i> </button><button data-id="'+row[i].id+'" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 i-l-d"> <i class="fa fa-remove"></i> </button>']);
                  }
                  res.end(JSON.stringify(arrObj));
            });
        }
    });
});

                      
router.post('/autoitem', function (req, res) {
    var rb = req.body;
    var cnd = '';
    if (rb.hsn != '-1')
        cnd = " AND hsn_code='" + rb.hsn + "' ";
    var sql="SELECT * FROM item WHERE company=" + req.session.user.cur_company + "  AND status='active' AND  ( code like '%" + rb.term + "%' OR specification like '%" + rb.term + "%') " + cnd +" LIMIT 20";
    db.query.selectCustomDb(sql , function (row) {
        res.end(JSON.stringify(row));
    });
});

router.get('/itembyid/:id', function (req, res) {
    db.query.selectDb('item', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});

router.get('/readxls', function (req, res) {
    db.query.uploadItem(req.session.user.cur_company);
});

router.post('/componentsave', function (req, res) {
    var rb = req.body;
    var product_cdd = moment(rb.product_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");

    db.query.deleteDb('component_mapping_details', " item=" + rb.compmapid, function (cmapdetailsdlt) {
        db.query.deleteDb('component_features', " item=" + rb.compmapid, function (cmapfeturesdlt) {
    db.query.insertDb('component_mapping_details', {item:rb.compmapid,company: req.session.user.cur_company,size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, moc: rb.product_moc,cdd: product_cdd, trim: rb.product_trim,order_quantity: rb.product_qty, inspection: rb.product_inspection, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category, created_by: req.session.user.id, modify_by: req.session.user.id}, function (compmapdtl) {});
    db.query.insertDb('component_features', {item:rb.compmapid,company: req.session.user.cur_company, body: rb.body, forged: rb.forged, bonet: rb.bonet, spindle: rb.spindle, rising: rb.rising, seat: rb.seat, renewable: rb.renewable,wedge: rb.wedge, loose_needle: rb.loose_needle, gland_boss: rb.gland_boss, single: rb.single,back_seat:rb.back_seat,integral:rb.integral, hand_wheel: rb.hand_wheel, gasket: rb.gasket,spiral_wound:rb.spiral_wound, created_by: req.session.user.id, modify_by: req.session.user.id}, function (compmapftr) {});
     });
    });
    Object.keys(rb.item).forEach(function (k) {
        db.query.deleteDb('component_mapping', " item=" + rb.compmapid, function (cmapdlt) {
        db.query.insertDb('component_mapping', {item:rb.compmapid,company: req.session.user.cur_company, component: rb.item[k].comp, sub_component: rb.item[k].sub_com, product: rb.item[k].prod, prod_quantity: rb.item[k].qnt, created_by: req.session.user.id, modify_by: req.session.user.id},function (compmap) {
                    generateLogFile({user: req.session.user.id, type: 'component mapping', time: new Date(), refer_id: compmap});
                });
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });
        });

    
    
});


function insertProduct(item, cid, result) {
    //console.log(typeof item[6]);
    //console.log(item[6]);
    if (item.length > 0 && item[6] != '' && typeof item[6] != 'undefined' && item[9] != '' && typeof item[9] != 'undefined' && item[8] != '' && typeof item[8] != 'undefined' && item[12] != '' && typeof item[12] != 'undefined' && item[10] != '' && typeof item[10] != 'undefined') {
        var code = item[6].toString().replace('mm', '').trim() + item[9].toString().trim() + item[8].toString().trim() + item[12].toString().replace('AISI', '').replace('-', '').trim() + item[10].toString().trim();
        db.query.selectDb('item', " code='" + code + "b'", function (row) {
            //console.log(row.length);
            //console.log(code);
            if (row.length == 0) {
                db.query.insertDb('item', {company: cid, code: code + "b", name: code + "b", pgroup: item[7], specification: item[0] + " " + item[1] + " " + item[2] + " " + item[3], unit: 'Nos', hsn_code: '84818030', tax_slabe: 18, sales_rate: item[5], material_type: item[4], class: item[11]}, function (iid) {
                    db.query.insertDb('item', {company: cid, code: code + "w", name: code + "w", pgroup: item[7], specification: item[0] + " " + item[1] + " " + item[2] + " " + item[3], unit: 'Nos', hsn_code: '84818030', tax_slabe: 18, sales_rate: item[5], material_type: item[4], class: item[11]}, function (iid) {
                        db.query.insertDb('item', {company: cid, code: code + "t", name: code + "t", pgroup: item[7], specification: item[0] + " " + item[1] + " " + item[2] + " " + item[3], unit: 'Nos', hsn_code: '84818030', tax_slabe: 18, sales_rate: item[5], material_type: item[4], class: item[11]}, function (iid) {
                            return new Promise(function (result) {

                                result(code);

                            });
                        });
                        ;

                    });
                    ;

                });
                ;

            }
        });

    }
}

module.exports = router;