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
        res.render('tmpl/product_codification/list.html');
});
router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
          
    db.query.getproditemcodificationVen({company:req.session.user.cur_company,type:'product',category:'finished',status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                // var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';
                    //var action = action = '<button data-id="' + data[0][i].id + '"  class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-sc " title="status_change"> <i class="fa fa-keyboard-o"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-view" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-v " title="View"> <i class="fa fa-eye"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> <i class="fa fa-remove"></i> </button>&nbsp;<button data-id="' + data[0][i].id + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> <i class="fa fa-wrench"></i></button>';
                   /*var action = '<div class="dropdown">'
                       action +='<button class="btn btn-primary dropdown-toggle " type="button" data-toggle="dropdown">Action<span class="caret"></span></button>'
                       action +='<ul class="dropdown-menu" style="background-color: rgb(0,0,0)">'
                       action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" data-permission = "sales-offer-edit" class="btn btn-icon waves-effect waves-light btn-warning m-b-5 s-l-e " title="Edit"> Edit Code</button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" data-permission = "sales-offer-delete" class="btn btn-icon waves-effect waves-light btn-danger m-b-5 s-l-d " title="Delete"> Delete </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-itm userrole-cls" data-permission = "sales-workorder-edit" title="finished_item"> Item </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-pf userrole-cls" data-permission = "sales-workorder-techno_commercial" title="prod_feature"> Feature </button></li>'
                       action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" class="btn btn-icon waves-effect waves-light btn-primary m-b-5 s-l-im userrole-cls" data-permission = "sales-workorder-techno_commercial" title="item_mapping"> Item Mapping </button></li>'
                       //action +='<li><button data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '" class="btn btn-icon waves-effect waves-light btn-info m-b-5 s-l-rawitm userrole-cls" data-permission = "sales-workorder-edit" title="raw_item"> Item(Raw) </button></li>'
                       action +='</ul>'
                       action +='</div>'*/

                   var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-e" title="edit_code"> Edit Code </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-itm" title="Item"> Item </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-pf" title="product_feature"> Product Feature </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-im" title="item_mapping"> Item Mapping </a>'
                       action += '</div>'
                       action += '</div>'
                
                    
                    arrObj.data.push([data[0][i].product_item_id ,data[0][i].name,data[0][i].specification,data[0][i].unit, action]);
            }
           // console.log(arrObj);
            
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/new', function (req, res) {
        db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' ORDER BY 'specification_no'" , function (specificcategory) {
        res.render('tmpl/product_codification/new.html',{specificcategory:specificcategory});
      });
});
router.get('/getprodspecificitem/:id', function (req, res) {
       db.query.selectCustomDb("SELECT * from prod_specification_item WHERE specification_id="+req.params.id, function (row) {
      res.end(JSON.stringify(row))
      });
});
router.get('/getoldcode', function (req, res) {
          var pid = req.query.pid;
          var prodid = pid.replace(/"/g,"");

        var sql="SELECT pc.id,psi.name,psi.code,pc.prod_specification_item,pc.prod_specification_category FROM product_codification pc INNER JOIN prod_specification_item psi ON pc.prod_specification_item = psi.id where  pc.product_item_id ='"+prodid+"'";
          db.query.selectCustomDb(sql , function (itemcode) {    
           res.end(JSON.stringify(itemcode))
      });
});
router.get('/getoldfeaturecode/:id', function (req, res) {
        var sql="SELECT iif.id,iif.feature_val,i.code,iif.product_feature,iif.item FROM item_feature iif INNER JOIN item i ON iif.item = i.id where iif.item="+req.params.id;
          db.query.selectCustomDb(sql , function (itemf) {    
           res.end(JSON.stringify(itemf))
      });
});
router.get('/edit/:id', function (req, res) {
  var prodid = req.params.id;
  console.log("editid "+prodid);
  db.query.selectDb('item', "status<>'delete' AND code='"+ prodid+"'"  , function (itmcode) {
  db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' ORDER BY 'specification_no'" , function (specificcategory) {
     db.query.selectDb('product_codification', "status<>'delete' AND product_item_id='"+ prodid+"'"  , function (row) {
        res.render('tmpl/product_codification/edit.html', {row: row[0],itmcode:itmcode[0],specificcategory:specificcategory});
          });    
      });
    });  
});
router.get('/delete', function (req, res) {
  var cid = req.query.id;
  var id = cid.replace(/"/g,"");
  var p_i_id = req.query.p_i_id;
  var pid = p_i_id.replace(/"/g,"");
  console.log('fg '+id);
  console.log('piid '+req.query.p_i_id);
    db.query.selectDb('product_codification', "status<>'delete' AND id=" +id, function (sl) {
      db.query.updateDbCustom('product_codification', {status:"delete"}, " product_item_id='"+pid+"'" , function (cid) {
        console.log('vv')
        generateLogFile({user: req.session.user.id, type: 'product codification delete', time: new Date(), refer: sl});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                        });
                 
        });
});
router.get('/item/:id', function (req, res) {
  db.query.selectDb('item', " id="+req.params.id, function (row) {
        db.query.selectDb('item_stock', " type='open' AND item=" + row[0].id, function (os) {
            if(os.length>0){
                res.render('tmpl/product_codification/item.html', {row: row[0], os: os[0], tax_slab: config.get('tax_slab')});
            }
            else{
                db.query.insertDb('item_stock', {item: row[0].id,os: {quantity:0,rate:0}, type: 'open', quantity: 0, rate: 0, unit: row[0].unit}, function (oid) {}); 
    res.render('tmpl/product_codification/item.html', {row: row[0],os: {quantity:0,rate:0},tax_slab: config.get('tax_slab')});
     }
  });
   });  

});
router.get('/prod_feature/:id', function (req, res) {
    db.query.selectDb('product_feature', " status<>'delete'", function (pf) {
     res.render('tmpl/product_codification/prod_feature.html', {pf:pf,itemid:req.params.id});
    });
});

router.get('/itemmapping/:id', function (req, res) {
    db.query.selectDb('component_category_name', "product_type = 'finished' AND status<>'delete' AND company=" + req.session.user.cur_company, function (row) {
       db.query.selectDb('item', " id=" + req.params.id, function (item) {
        db.query.selectDb('component_mapping', " item=" + req.params.id, function (itemmaping) {
            //db.query.selectDb('component_mapping_details', " item=" + req.params.id, function (compmap) {
                var sql = "SELECT id,company,item,size,type,class,figure,ends,moc,size_id,trim,order_quantity,inspection,hydraulic_body,hydraulic_seat,pneumatic_seat,hydroback_seat,unit_rate,category,prod_feature,DATE_FORMAT(cdd,'%m/%d/%Y') cdd FROM `component_mapping_details` WHERE item=" + req.params.id;
                    db.query.selectCustomDb(sql , function (compmap) { 
      res.render('tmpl/product_codification/itemmapping.html',{row:row,item:item[0],compmap:compmap[0],itemmaping:itemmaping});
        });
     });
   }); 
 });
});
router.get('/rawitem/:id', function (req, res) {
  db.query.selectDb('item', " id="+req.params.id, function (row) {
        db.query.selectDb('item_stock', " type='open' AND item=" + row[0].id, function (os) {
            if(os.length>0){
                res.render('tmpl/product_codification/rawitem.html', {row: row[0], os: os[0], tax_slab: config.get('tax_slab')});
            }
            else{
                db.query.insertDb('item_stock', {item: row[0].id,os: {quantity:0,rate:0}, type: 'open', quantity: 0, rate: 0, unit: row[0].unit}, function (oid) {}); 
    res.render('tmpl/product_codification/rawitem.html', {row: row[0],os: {quantity:0,rate:0},tax_slab: config.get('tax_slab')});
     }
  });
   });  

});
router.get('/getfinishedolditem/:id', function (req, res) {
      
        var sql="SELECT item.id,component_mapping.component,component_mapping.sub_component,component_mapping.prod_quantity,item.code FROM component_mapping INNER JOIN item ON component_mapping.product = item.id where component_mapping.item="+req.params.id;
    db.query.selectCustomDb(sql , function (itemmaping) {
     // console.log('imap '+itemmaping.code);      
      res.end(JSON.stringify(itemmaping))
        });
});

router.get('/getfinishedsubname/:id', function (req, res) {
   console.log("hi "+req.params.id);
  db.query.selectCustomDb("SELECT id,component_subname, component_category_name from component_category_subname WHERE component_category_name="+req.params.id, function (row) {
      res.end(JSON.stringify(row))

 });
});

router.get('/getfinishedprod/:txt', function (req, res) {
    
 var sql="SELECT * FROM item WHERE company=" + req.session.user.cur_company + "  AND category='raw' AND  ( code like '%" + req.params.txt + "%')  LIMIT 10";
    db.query.selectCustomDb(sql , function (item) {

      res.end(JSON.stringify(item));
     // res.render('tmpl/item/componentmapping.html',{prod:prod});

 });
});


router.post('/save', function (req, res) {
    var rb = req.body;
       console.log("prodid "+rb.prodid); 
       db.query.ckDuplicateCode({code: rb.product_code.trim(), id: rb.itmid}, function (stat) {
        if (stat == true) {    
     if (rb.prodid != undefined) {
            var itmvar = {code:rb.product_code.trim(),modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('item', itmvar, rb.itmid, function (itmid) {
              Object.keys(rb.category).forEach(function (k) {
            var pvar = {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:rb.product_code.trim()};
            db.query.deleteDb('product_codification', "product_item_id='"+rb.prodid+"'", function (cid) {
            db.query.insertDb('product_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:rb.product_code.trim(),created_by:req.session.user.id}, function (pid) {});
                generateLogFile({user: req.session.user.id, type: 'product codification modification', time: new Date()});
                });
               res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });        
        });
        }
           else{ 
              

                db.query.insertDb('item', {code:rb.product_code.trim(),company:req.session.user.cur_company,created_by:req.session.user.id}, function (itmid) {
                Object.keys(rb.category).forEach(function (k) {
                 db.query.insertDb('product_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:rb.product_code.trim(),created_by:req.session.user.id}, function (cid) {
                 generateLogFile({user: req.session.user.id, type: 'product codification creation', time: new Date(), refer_id: cid});
                });
                 });
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                });
          
         }  
         } else {
            res.end(JSON.stringify({'code': '2', 'msg': 'Duplicate product code!!!'}));
        }
    });
       
});

router.post('/itemsave', function (req, res) {
    var rb = req.body;
          db.query.selectDb('item_stock', " item="+rb.iid, function (row) {  
            if(typeof row[0] != 'undefined'){
               db.query.updateDbCustom('item_stock', {quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, " type='open' AND item=" + rb.iid, function (sid) {});
            }
            else{
               db.query.insertDb('item_stock', {item:rb.iid, type: 'open', quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, function (oid) {});
            }
                db.query.updateDb('item', {name: rb.name,pgroup: rb.group, specification: rb.specification, unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.iid, function (iid) {
                    generateLogFile({user: req.session.user.id, type: 'item modification', time: new Date(), refer_id: rb.iid});
                });
              });
            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                  

});
router.post('/rawitemsave', function (req, res) {
    var rb = req.body;
          db.query.selectDb('item_stock', " item="+rb.iid, function (row) {  
            if(typeof row[0] != 'undefined'){
               db.query.updateDbCustom('item_stock', {quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, " type='open' AND item=" + rb.iid, function (sid) {});
            }
            else{
               db.query.insertDb('item_stock', {item:rb.iid, type: 'open', quantity: rb.ostock, rate: rb.orate, unit: rb.unit}, function (oid) {});
            }
                db.query.updateDb('item', {name: rb.name,pgroup: rb.group,category:'raw', specification: rb.specification, unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.iid, function (iid) {
                    generateLogFile({user: req.session.user.id, type: 'raw item modification', time: new Date(), refer_id: rb.iid});
                });
              });
            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                  

});

router.post('/pfsave', function (req, res) {
    var rb = req.body;
               db.query.deleteDb('item_feature', "item='"+rb.iid+"'", function (cid) {
               Object.keys(rb.category).forEach(function (k) {
                    db.query.insertDb('item_feature', {item:rb.iid,product_feature:rb.category[k].pfitmid,feature_val:rb.category[k].pfval,created_by:req.session.user.id}, function (oid) {
                    generateLogFile({user: req.session.user.id, type: 'item creation', time: new Date(), refer_id: oid});
                });
                  });

            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                  
          });
});

router.post('/itemmappingsave', function (req, res) {
    var rb = req.body;
    var product_cdd = moment(rb.product_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectDb('component_mapping_details', " item="+ rb.compmapid, function (row) {  
    if(typeof row[0] != 'undefined'){
      db.query.updateDbCustom('component_mapping_details', {size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, moc: rb.product_moc,cdd: product_cdd, trim: rb.product_trim,order_quantity: rb.product_qty, inspection: rb.product_inspection, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category,modify_by: req.session.user.id}, "item=" + rb.compmapid, function (sid) {});
    }
    else{
    db.query.insertDb('component_mapping_details', {item:rb.compmapid,company: req.session.user.cur_company,size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, moc: rb.product_moc,cdd: product_cdd, trim: rb.product_trim,order_quantity: rb.product_qty, inspection: rb.product_inspection, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category, created_by: req.session.user.id}, function (compmapdtl) {});
     }
     });
    Object.keys(rb.item).forEach(function (k) {
      console.log("prod "+rb.item[k].prod);
        db.query.deleteDb('component_mapping', " item=" + rb.compmapid, function (cmapdlt) {
        db.query.insertDb('component_mapping', {type:'finished',item:rb.compmapid,company: req.session.user.cur_company, component: rb.item[k].comp, sub_component: rb.item[k].sub_com,product:rb.item[k].prod, prod_quantity: rb.item[k].qnt, created_by: req.session.user.id, modify_by: req.session.user.id},function (compmap) {
                    generateLogFile({user: req.session.user.id, type: 'component mapping', time: new Date(), refer_id: compmap});
                });
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));

        });

    
    
  });

});


module.exports = router;