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
                       action +='</div>'
                       
                       var action  = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-e" title="edit_code"> Edit Code </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-itm" title="Item"> Item </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-pf" title="product_feature"> Product Feature </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-im" title="item_mapping"> Item Mapping </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-m" title="mapping"> Mapping </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-dm" title="draing_mapping"> Drawing Mapping </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-dv" title="draing_view"> Drawing View </a>'
                       action += '</div>'
                       action += '</div>'
                       */
                   var action  = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-e" title="edit_code"> Edit Code </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-sa" title="save_as"> Save As </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-itm" title="Item"> Item </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-im" title="item_mapping"> Item Mapping </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-dm" title="draing_mapping"> Drawing Mapping </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-dv" title="draing_view"> Drawing View </a>'
                       if(data[0][i].size_id != null){
                       action += '<a data-id="' + data[0][i].id + '" data-prodcode="' + data[0][i].product_item_id + '" data-itemid="' + data[0][i].itemid + '"  class="dropdown-item s-l-subcode" title="sub_codification"> Sub Codification </a>'
                       }
                       action += '</div>'
                       action += '</div>'
                       //console.log('size_id '+ data[0][i].size_id);
                    
                    arrObj.data.push([data[0][i].product_item_id ,data[0][i].size_id,data[0][i].specification,data[0][i].unit, action]);
            }
           // console.log(arrObj);
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/new', function (req, res) {
        db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='codification' ORDER BY 'specification_no'" , function (specificcategory) {
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
        var sql="SELECT iif.id,psf.id as feature_val,i.code,iif.product_feature,iif.item FROM item_feature iif INNER JOIN item i ON iif.item = i.id INNER JOIN product_sub_feature psf ON psf.id = iif.feature_val where iif.item="+req.params.id;
          console.log("SELECT iif.id,psf.name as feature_val,i.code,iif.product_feature,iif.item FROM item_feature iif INNER JOIN item i ON iif.item = i.id INNER JOIN product_sub_feature psf ON psf.id = iif.feature_val where iif.item="+req.params.id)
           db.query.selectCustomDb(sql , function (itemf) {    
           res.end(JSON.stringify(itemf))
      });
});
router.get('/edit/:id', function (req, res) {
  var prodid = req.params.id;
 console.log("editid "+prodid);
  db.query.selectDb('item', "status<>'delete' AND id='"+ prodid+"'"  , function (itmcode) {
    db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='codification' ORDER BY 'specification_no'" , function (specificcategory) {
      //console.log(row);
      db.query.selectDb('product_codification', "status<>'delete' AND product_item_id='"+ prodid+"'", function (row) {
        res.render('tmpl/product_codification/edit.html', {row: row[0],itmcode:itmcode[0],specificcategory:specificcategory});
      });    
    });
  });  
});
router.get('/save_as/:id', function (req, res) {
  var prodid = req.params.id;
 console.log("editid "+prodid);
  db.query.selectDb('item', "status<>'delete' AND id='"+ prodid+"'"  , function (itmcode) {
    db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='codification' ORDER BY 'specification_no'" , function (specificcategory) {
      //console.log(row);
      db.query.selectDb('product_codification', "status<>'delete' AND product_item_id='"+ prodid+"'", function (row) {
        res.render('tmpl/product_codification/saveas.html', {row: row[0],itmcode:itmcode[0],specificcategory:specificcategory});
      });    
    });
  });  
});
router.get('/delete/:id', function (req, res) {
  //var cid = req.query.id;
 // var id = cid.replace(/"/g,"");
 // var p_i_id = req.query.p_i_id;
 // var pid = p_i_id.replace(/"/g,"");
 // console.log('fg '+id);
 // console.log('piid '+req.query.p_i_id);
    db.query.deleteDb('product_codification', "product_item_id='"+req.params.id+"'", function (cid) {
        db.query.deleteDb('item', "id='"+req.params.id+"'", function (iid) {});
        db.query.deleteDb('component_mapping', "item='"+req.params.id+"'", function (iid) {});
        db.query.deleteDb('component_mapping_details', "item='"+req.params.id+"'", function (iid) {});
        db.query.deleteDb('item_stock', "item='"+req.params.id+"'", function (iid) {});
        db.query.deleteDb('opening_stock', "item='"+req.params.id+"'", function (iid) {});
        db.query.deleteDb('product_sub_codification', "item='"+req.params.id+"'", function (iid) {});
        generateLogFile({user: req.session.user.id, type: 'product delete', time: new Date(), refer: cid});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
      });    
  });
router.get('/item/:id', function (req, res) {
  var sql="SELECT pc.product_full_form FROM product_codification pc INNER JOIN item i ON pc.product_item_id = i.id where i.id="+req.params.id;
    db.query.selectCustomDb(sql , function (prodname) {
      var txt = prodname[0].product_full_form 
      var pname = txt.replace(/[***]/g, "/");
     db.query.selectDb('prod_unit', " status<>'delete' ", function (punit) {      
    db.query.selectDb('item', " id="+req.params.id, function (row) {
        db.query.selectDb('item_stock', "item=" + row[0].id, function (os) {
            if(os.length>0){
                res.render('tmpl/product_codification/item.html', {row: row[0], os: os[0], tax_slab: config.get('tax_slab'),pname:pname,punit:punit});
            }
            else{
                db.query.insertDb('item_stock', {item: row[0].id,os: {quantity:0,rate:0}, quantity: 0, rate: 0}, function (oid) {}); 
              res.render('tmpl/product_codification/item.html', {row: row[0],os: {quantity:0,rate:0},tax_slab: config.get('tax_slab'),pname:pname,punit:punit});
            }
         });
       });
     });  
   });
});
router.get('/prod_feature/:id', function (req, res) {
    db.query.selectDb('product_feature', " status<>'delete'", function (pf) {
     res.render('tmpl/product_codification/prod_feature.html', {pf:pf,itemid:req.params.id});
    });
});
router.get('/getprodsubfeature/:id', function (req, res) {
  db.query.selectCustomDb("SELECT * from product_sub_feature WHERE status<>'delete' AND prod_feature="+req.params.id, function (row) {
     res.end(JSON.stringify(row))
   });
});
router.get('/itemmapping/:id', function (req, res) {
  db.query.selectDb('hydro_test', "status<>'delete' AND company=" + req.session.user.cur_company, function (hydro) {
    db.query.selectDb('component_category_name', "product_type = 'finished' AND status<>'delete' AND company=" + req.session.user.cur_company, function (row) {
       db.query.selectDb('item', " id=" + req.params.id, function (item) {
          db.query.selectDb('forging', " status<>'delete' ", function (forg) {
        db.query.selectDb('prod_unit', " status<>'delete' ", function (punit) {   
        db.query.getprodcodedetails({code:item[0].id}, function (proddi) {
        //console.log(proddi[0].size);
         db.query.selectDb('component_mapping', " item=" + req.params.id, function (itemmaping) {
          db.query.selectDb('hydro_test', "status<>'delete' AND company='"+ req.session.user.cur_company +"' AND class='"+proddi[0].clasc+"'" , function (fnlhydro) {
            //db.query.selectDb('component_mapping_details', " item=" + req.params.id, function (compmap) {
             var sql2 = "SELECT cm.id,cm.prod_quantity,cm.component_type,cm.forging,cm.diameter,cm.length,cm.punit,ccn.id as ccnid,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname FROM component_mapping cm INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature WHERE cm.item=" + req.params.id;
               console.log(sql2);
               db.query.selectCustomDb(sql2 , function (mapping) { 
                var sql = "SELECT cmd.id,cmd.company,cmd.item,cmd.size,cmd.type,cmd.class,cmd.figure,ends,cmd.size_id,cmd.hydraulic_body,cmd.hydraulic_seat,cmd.pneumatic_seat,cmd.hydroback_seat,cmd.unit_rate,cmd.category,cmd.prod_feature,i.tax_slabe FROM `component_mapping_details` cmd INNER JOIN item i ON cmd.item = i.id WHERE cmd.item=" + req.params.id;
                  db.query.selectCustomDb(sql , function (compmap) { 
                 res.render('tmpl/product_codification/itemmapping.html',{row:row,item:item[0],compmap:compmap[0],itemmaping:itemmaping,mapping:mapping,proddi:proddi[0],hydro:hydro,fnlhydro:fnlhydro[0],tax_slab: config.get('tax_slab'),forg:forg,punit:punit});
               });
             });
           });
        });
       });
         });
       });
     });
   }); 
 });
});
router.get('/mapping/:id', function (req, res) { 
    var sql = "SELECT cm.id,cm.product,ccn.id as ccnid,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname,cm.prod_quantity,i.code,i.specification,i.hsn_code FROM component_mapping cm  INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature LEFT JOIN item i ON i.id=cm.product WHERE cm.item=" + req.params.id;
        db.query.selectCustomDb(sql , function (mapping) { 
   res.render('tmpl/product_codification/mapping.html', {tax_slab: config.get('tax_slab'),mapping:mapping});  
  });
});
router.get('/drawingmapping/:id', function (req, res) { 
    var sql = "SELECT cm.id,cm.product,ccn.id as ccnid,cm.drawing_no,cm.drawing_file,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname,cm.prod_quantity,i.code,i.specification,i.hsn_code FROM component_mapping cm INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature LEFT JOIN item i ON i.id=cm.product WHERE cm.item=" + req.params.id;
        db.query.selectCustomDb(sql , function (mapping) { 
   res.render('tmpl/product_codification/drawing_mapping.html', {tax_slab: config.get('tax_slab'),mapping:mapping});  
  });
});
router.get('/drawingview/:id', function (req, res) {
  var sql = "SELECT id,drawing_no,drawing_file FROM component_mapping WHERE item='" + req.params.id + "'";
        db.query.selectCustomDb(sql, function (row) {
        res.render('tmpl/product_codification/drawing_view.html', {row: row,sid:req.params.id});
    });
});
router.get('/docdelete/:id', function (req, res) {
  console.log("kk "+req.params.id);
    db.query.updateDb('component_mapping', {drawing_file:'', modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, req.params.id, function (row) {
       generateLogFile({user: req.session.user.id, type: 'drawing file delete', time: new Date(), refer: req.params.id});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
         });
});
router.get('/itemdelete/:id', function (req, res) {
    db.query.deleteDb('component_mapping', "id='"+req.params.id+"'", function (cid) {
       generateLogFile({user: req.session.user.id, type: 'drawing file delete', time: new Date(), refer: req.params.id});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
         });
     
});
router.get('/rawitem/:id', function (req, res) {
  db.query.selectDb('item', " id="+req.params.id, function (row) {
        db.query.selectDb('item_stock', " item=" + row[0].id, function (os) {
            if(os.length>0){
                res.render('tmpl/product_codification/rawitem.html', {row: row[0], os: os[0], tax_slab: config.get('tax_slab')});
            }
            else{
                db.query.insertDb('item_stock', {item: row[0].id, quantity: 0, rate: 0}, function (oid) {}); 
    res.render('tmpl/product_codification/rawitem.html', {row: row[0],os: {quantity:0,rate:0},tax_slab: config.get('tax_slab')});
     }
  });
 });  
});
router.get('/getfinishedolditem/:id', function (req, res) {
      
        var sql="SELECT item.id,component_mapping.component,component_mapping.sub_component,component_mapping.prod_quantity,item.code FROM component_mapping INNER JOIN item ON component_mapping.product = item.id where component_mapping.item="+req.params.id;
          db.query.selectCustomDb(sql , function (itemmaping) {
          res.end(JSON.stringify(itemmaping))
        });
});

router.get('/getfinishedsubname/:id', function (req, res) {
  // console.log("hi "+req.params.id);
  db.query.selectCustomDb("SELECT id,component_subname, component_category_name from component_category_subname WHERE component_category_name="+req.params.id, function (row) {
      res.end(JSON.stringify(row))

 });
});
router.get('/getfeature/:id', function (req, res) {
  // console.log("hi "+req.params.id);
  db.query.selectCustomDb("SELECT id,name from product_feature WHERE status<>'delete' AND component_category_name="+req.params.id, function (row) {
      res.end(JSON.stringify(row))
 });
});
router.get('/getsubfeature/:id', function (req, res) {
  db.query.selectCustomDb("SELECT id,name from product_sub_feature WHERE prod_feature ="+req.params.id, function (row) {
      res.end(JSON.stringify(row))
 });
});
router.get('/getfinishedprod/:txt', function (req, res) { 
 var sql="SELECT * FROM item WHERE company=" + req.session.user.cur_company + "  AND category='finished' AND  ( code like '%" + req.params.txt + "%')  LIMIT 10";
    db.query.selectCustomDb(sql , function (item) {
      res.end(JSON.stringify(item));
     // res.render('tmpl/item/componentmapping.html',{prod:prod});
 });
});
router.post('/autoitem', function (req, res) {
    var rb = req.body;
    var sql="SELECT * FROM item WHERE company=" + req.session.user.cur_company + " AND category='raw'  AND status='active' AND  ( code like '%" + rb.term + "%' OR specification like '%" + rb.term + "%')  LIMIT 20";
    db.query.selectCustomDb(sql , function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/itembyid/:id', function (req, res) {
    db.query.selectDb('item', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.post('/save', function (req, res) {
    var rb = req.body;
      // console.log("prodid "+rb.prodid); 
       db.query.ckDuplicateCode({code: rb.product_code.trim(), id: rb.itmid}, function (stat) {
        if (stat == true) {    
     if (rb.prodid != undefined) {
            var itmvar = {code:rb.product_code.trim(),modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('item', itmvar, rb.itmid, function (itmid) {
              Object.keys(rb.category).forEach(function (k) {
            var pvar = {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:rb.product_code.trim()};
            db.query.deleteDb('product_codification', "product_item_id='"+rb.prodid+"'", function (cid) {
            db.query.insertDb('product_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:rb.product_code.trim(),product_full_form:rb.product_name,created_by:req.session.user.id}, function (pid) {});
                generateLogFile({user: req.session.user.id, type: 'product codification modification', time: new Date()});
                });
               res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });        
        });
        }
           else{ 
                db.query.insertDb('item', {code:rb.product_code.trim(),specification:rb.product_name,company:req.session.user.cur_company,created_by:req.session.user.id}, function (itmid) {
                db.query.insertDb('item_stock', {item:itmid,quantity: 0, rate: 0}, function (oid) {});
                db.query.insertDb('opening_stock', {item:itmid,quantity: 0, rate: 0}, function (oid) {});
                Object.keys(rb.category).forEach(function (k) {
                 db.query.insertDb('product_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:itmid,created_by:req.session.user.id}, function (cid) {
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
router.post('/saveAsCopy', function (req, res) {
    var rb = req.body;
       console.log("prodid "+rb.product_code.trim()); 
       db.query.ckDuplicateCode({code: rb.product_code.trim()}, function (stat) {
        if (stat == true) {    
                db.query.insertDb('item', {code:rb.product_code.trim(),specification:rb.product_name,company:req.session.user.cur_company,created_by:req.session.user.id}, function (itmid) {
                db.query.insertDb('item_stock', {item:itmid,quantity: 0, rate: 0}, function (oid) {});
                db.query.insertDb('opening_stock', {item:itmid,quantity: 0, rate: 0}, function (oid) {});
                Object.keys(rb.category).forEach(function (k) {
                 db.query.insertDb('product_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,product_item_id:itmid,created_by:req.session.user.id}, function (cid) {
                 generateLogFile({user: req.session.user.id, type: 'product codification creation', time: new Date(), refer_id: cid});
                });
                 });
                db.query.selectDb('component_mapping', " item=" + rb.itmid, function (cmapping) {
                  for(var k in cmapping){
                    db.query.insertDb('component_mapping', {type:'finished',item:itmid,company: req.session.user.cur_company,component: cmapping[k].component, component_feature: cmapping[k].component_feature,component_sub_feature: cmapping[k].component_sub_feature, prod_quantity: cmapping[k].prod_quantity,drawing_file:cmapping[k].drawing_file,drawing_no:cmapping[k].drawing_no, created_by: req.session.user.id},function (compmap) {});
                  }
                });
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                });
  
         } else {
            res.end(JSON.stringify({'code': '3', 'msg': 'Error'}));
        }
    });
       
});

router.post('/itemsave', function (req, res) {
    var rb = req.body;
          db.query.selectDb('item_stock', " item="+rb.iid, function (row) {  
           
                db.query.updateDb('item', {name: rb.name,pgroup: rb.group, specification: rb.specification, unit: rb.unit, hsn_code: rb.hsn_code, tax_slabe: rb.tax_slabe, multi_unit: rb.multi_unit, unit_one_no: rb.unit_one_no, unit_two: rb.unit_two, unit_two_no: rb.unit_two_no, unit_three: rb.unit_three, unit_three_no: rb.unit_three_no, sales_rate: rb.sales_rate, sales_discount: rb.sales_discount, purchase_rate: rb.purchase_rate, description: rb.description, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.iid, function (iid) {
                    generateLogFile({user: req.session.user.id, type: 'item modification', time: new Date(), refer_id: rb.iid});
                });
              });
            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
                  

});
router.post('/rawitemsave', function (req, res) {
    var rb = req.body;
          db.query.selectDb('item_stock', " item="+rb.iid, function (row) {  
            
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
    //var product_cdd = moment(rb.product_cdd + ' 12:00:00').utc().format("YYYY-MM-DD HH:mm:ss");
    db.query.selectDb('component_mapping_details', " item="+ rb.compmapid, function (row) {  
    if(typeof row[0] != 'undefined'){
      db.query.updateDbCustom('component_mapping_details', {size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends,hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category,modify_by: req.session.user.id}, "item=" + rb.compmapid, function (sid) {});
      //db.query.updateDbCustom('component_mapping_details', {size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, moc: rb.product_moc,cdd: product_cdd, trim: rb.product_trim,order_quantity: rb.product_qty, inspection: rb.product_inspection, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category,modify_by: req.session.user.id}, "item=" + rb.compmapid, function (sid) {});
      //db.query.updateDbCustom('item_stock', {quantity: rb.product_qty, rate: rb.product_unit_rate}, " item=" + rb.compmapid, function (sid) {});
      //db.query.updateDbCustom('opening_stock', {quantity: rb.product_qty, rate: rb.product_unit_rate}, " item=" + rb.compmapid, function (sid) {});
      db.query.updateDbCustom('item', {current_stock: rb.product_qty,current_rate:rb.product_unit_rate,tax_slabe:rb.taxslabe}, " id=" + rb.compmapid, function (sid) {});
      res.end(JSON.stringify({'code': '2', 'msg': 'Success'}));
    }
    else{
    db.query.insertDb('component_mapping_details', {item:rb.compmapid,company: req.session.user.cur_company,size_id:rb.size_id, size: rb.product_size, type: rb.product_type, class: rb.product_class, figure: rb.product_figure, ends: rb.product_ends, hydraulic_body: rb.product_hydraulic_body, hydraulic_seat: rb.product_hydraulic_seat,pneumatic_seat:rb.product_pneumatic_seat,hydroback_seat:rb.product_hydroback_seat, unit_rate: rb.product_unit_rate, category: rb.product_category, created_by: req.session.user.id}, function (compmapdtl) {});
    db.query.updateDbCustom('item', {current_stock: rb.product_qty,tax_slabe:rb.taxslabe}, " id=" + rb.compmapid, function (sid) {});
     res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
     }
     Object.keys(rb.item).forEach(function (k) {
    if(rb.item[k].pid != 0){
      console.log("pid "+rb.item[k].pid);
        db.query.updateDbCustom('component_mapping', {component: rb.item[k].comp, component_feature: rb.item[k].ftre,component_sub_feature: rb.item[k].sub_ftre, prod_quantity: rb.item[k].qnty,component_type:rb.item[k].cmpnttype,forging:rb.item[k].forging,diameter:rb.item[k].diameter,length:rb.item[k].lngth,punit:rb.item[k].punit, created_by: req.session.user.id, modify_by: req.session.user.id}," id=" + rb.item[k].pid,function (compmap) {
                    generateLogFile({user: req.session.user.id, type: 'component mapping updated', time: new Date(), refer_id: compmap});
                });
      }
      else{
        db.query.insertDb('component_mapping', {type:'finished',item:rb.compmapid,company: req.session.user.cur_company, component: rb.item[k].comp, component_feature: rb.item[k].ftre,component_sub_feature: rb.item[k].sub_ftre, prod_quantity: rb.item[k].qnty,component_type:rb.item[k].cmpnttype,forging:rb.item[k].forging,diameter:rb.item[k].diameter,length:rb.item[k].lngth,punit:rb.item[k].punit, created_by: req.session.user.id, modify_by: req.session.user.id}, function (compmap) {
        generateLogFile({user: req.session.user.id, type: 'component mapping created', time: new Date(), refer_id: compmap});
        });
      }
      res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
  });
      db.query.selectDb('opening_stock', "item=" + rb.compmapid, function (os) {
            if(os.length>0){
              db.query.updateDbCustom('opening_stock', {quantity: rb.product_qty, rate: rb.product_unit_rate}, " item=" + rb.compmapid, function (sid) {});
            }
            else{
                db.query.insertDb('opening_stock', {item:rb.compmapid,quantity: rb.product_qty, rate: rb.product_unit_rate}, function (oid) {}); 
              }

     });
      db.query.selectDb('item_stock', "item=" + rb.compmapid, function (os) {
            if(os.length>0){
              db.query.updateDbCustom('item_stock', {quantity: rb.product_qty, rate: rb.product_unit_rate}, " item=" + rb.compmapid, function (sid) {});
            }
            else{
                db.query.insertDb('item_stock', {item:rb.compmapid,quantity: rb.product_qty, rate: rb.product_unit_rate}, function (oid) {}); 
              }
       });
     });
});
router.post('/mappingsave', function (req, res) {
    var rb = req.body;
    Object.keys(rb.item).forEach(function (k) {
      var prod='';
      console.log("h1 "+rb.item[k].old_prod);
      console.log("h2 "+rb.item[k].prod);
      if(rb.item[k].old_prod != ''){
        if(rb.item[k].prod != 0){
          prod = rb.item[k].prod
        }
        else{
          prod = rb.item[k].old_prod
        }
      }
        db.query.updateDbCustom('component_mapping', {product:prod},"id=" + rb.item[k].id ,function (compmap) {
                    generateLogFile({user: req.session.user.id, type: 'mapping', time: new Date(), refer_id: compmap});
                });
        res.end(JSON.stringify({'code': rb.item[k].id, 'msg': 'Success'}));

        });    
  });
router.post('/drawingmappingsave', function (req, res) {
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('drawing_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
       var itm = JSON.parse(fields.itm);
       Object.keys(itm).forEach(function (k) {
         db.query.updateDbCustom('component_mapping', {drawing_no:itm[k].drawing_no,modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id},"id=" + itm[k].id ,function (compmap) {
          generateLogFile({user: req.session.user.id, type: 'drawing mapping', time: new Date(), refer_id: compmap});
        });
       });
         res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
               
});

});
router.post('/docsave', function (req, res) {
  console.log("rrrrt");
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('drawing_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
       var docname = '';
            if(typeof (files.doc_upld) != 'undefined' ){
              docname = ctime + files.doc_upld.name;
              console.log("length "+docname.length);
            }
            if(docname.length > 0 || docname != ''){
              console.log("docname "+docname);
              console.log("iid "+fields.id);
              db.query.updateDbCustom('component_mapping', {drawing_file:docname,modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id},"id=" + fields.id ,function (compmap) {
              generateLogFile({user: req.session.user.id, type: 'drawing mapping update', time: new Date(), refer_id: compmap});
              res.end(JSON.stringify({'code': fields.id, 'msg': 'Success'}));
              });
            }

         //    res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
});
});
router.get('/sub_codification/:id', function (req, res) {
  db.query.selectDb('component_mapping_details', "item='"+ req.params.id+"'", function (row) {
      if(row.length > 0){
    res.render('tmpl/product_codification/sub_codification_list.html',{scid:req.params.id,row:row[0]});  
  }
});
});
router.post('/ajaxsubcodificationget/:id', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getsubcodificationVen({item: req.params.id, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            for (var i = 0; i < data[0].length; i++) {
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '" data-subitm="'+ data[0][i].sub_item +'" data-itm="'+ data[0][i].item +'"  class="dropdown-item s-l-sce" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '" data-subitm="'+ data[0][i].sub_item +'" data-itm="'+ data[0][i].item +'"  class="dropdown-item s-l-scd" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                    arrObj.data.push([data[0][i].code,data[0][i].specification,action]);
            }
        }
        res.end(JSON.stringify(arrObj));
   // });
  });
});
router.get('/sub_new/:id', function (req, res) {
  db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='subcodification' ORDER BY 'specification_no'" , function (specificcategory) {
     res.render('tmpl/product_codification/sub_new.html',{specificcategory:specificcategory,itemid:req.params.id});
  });
});
router.get('/sub_edit/:id', function (req, res) {
  var subitm = req.params.id;
  console.log("editid "+subitm);
    db.query.selectCustomDb("SELECT * FROM prod_specification_category WHERE company=" + req.session.user.cur_company + " AND status<>'delete' AND show_page='subcodification' ORDER BY 'specification_no'" , function (specificcategory) {
      db.query.selectDb('product_sub_codification', "status<>'delete' AND sub_item='"+ subitm+"'", function (row) {
        res.render('tmpl/product_codification/sub_edit.html', {row: row[0],specificcategory:specificcategory});
      });    
   }); 
});
router.get('/getsuboldcode', function (req, res) {
          var pid = req.query.pid;
          var prodid = pid.replace(/"/g,"");
        var sql="SELECT psc.id,psi.name,psi.code,psc.prod_specification_item,psc.prod_specification_category FROM product_sub_codification psc INNER JOIN prod_specification_item psi ON psc.prod_specification_item = psi.id where  psc.sub_item ='"+prodid+"'";
          db.query.selectCustomDb(sql , function (itemcode) {    
           res.end(JSON.stringify(itemcode))
      });
});
router.get('/sub_delete', function (req, res) {
  var cid = req.query.id;
  var item = cid.replace(/"/g,"");
  var p_i_id = req.query.p_i_id;
  var subitm = p_i_id.replace(/"/g,"");
  db.query.updateDb('sub_item', {status:'delete',modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()},subitm, function (did) {
  db.query.deleteDb('product_sub_codification', "sub_item='"+subitm+"' AND item='"+item+"'", function (cid) {
     generateLogFile({user: req.session.user.id, type: 'product sub codification delete', time: new Date(), refer: did});
          res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
      });
    });  
  });
router.post('/sub_save', function (req, res) {
    var rb = req.body;
      // console.log("prodid "+rb.prodid);  
     if (rb.subitmid != undefined) {
       console.log("update "+rb.subid+' '+rb.itmid);
       db.query.updateDb('sub_item', {item:rb.itmid,code:rb.code.trim(),specification:rb.product_specification.trim(),name:rb.product_name,modify_by: req.session.user.id,modification_date: new Date().toMysqlFormat()},rb.subitmid, function (did) {
       db.query.deleteDb('product_sub_codification', "sub_item='"+rb.subitemid+"' AND item='"+rb.itmid+"'", function (cid) {
          Object.keys(rb.category).forEach(function (k) {
            db.query.insertDb('product_sub_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,item:rb.itmid,sub_item:rb.subitmid}, function (pid) {});
             generateLogFile({user: req.session.user.id, type: 'product sub codification modification', time: new Date(), refer_id: rb.subitmid});
             });
             res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
             });
           });
          }
          else{
                db.query.insertDb('sub_item', {company:req.session.user.cur_company,item:rb.itmid,code:rb.code.trim(),specification:rb.product_specification.trim(),name:rb.product_name,created_by:req.session.user.id}, function (did) {
                Object.keys(rb.category).forEach(function (k) {
                 db.query.insertDb('product_sub_codification', {prod_specification_category:rb.category[k].specificid,prod_specification_item:rb.category[k].item_name,item:rb.itmid,sub_item:did}, function (cid) {
                 generateLogFile({user: req.session.user.id, type: 'product sub codification creation', time: new Date(), refer_id: did});
                });
                 });
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
              });
          }

});
router.post('/drawingnosave', function (req, res) {
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('drawing_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
       
              db.query.updateDbCustom('component_mapping', {drawing_no:fields.dno,modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id},"id=" + fields.id ,function (compmap) {
              generateLogFile({user: req.session.user.id, type: 'drawing mapping update', time: new Date(), refer_id: compmap});
              res.end(JSON.stringify({'code': fields.id, 'msg': 'Success'}));
              });
            
         //    res.end(JSON.stringify({'code': 1, 'msg': 'Success'}));
});
});
router.post('/drawingmappingdelete', function (req, res) {
    var rb = req.body;
    Object.keys(rb.itm).forEach(function (k) {
      db.query.updateDbCustom('component_mapping', {drawing_file:'',drawing_no:''},"id=" + rb.itm[k].id ,function (compmap) {
          generateLogFile({user: req.session.user.id, type: 'mapping', time: new Date(), refer_id: compmap});
               res.end(JSON.stringify({'code': rb.itm[k].id, 'msg': 'Success'}));
                });
  

        });    
  });
module.exports = router;