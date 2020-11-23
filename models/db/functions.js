var mysql = require('mysql'),
    jsonfile = require('jsonfile'),
    config = require('config');

var dp = exports.poolDatabase = {
pconnection: '',
connectDB: function () {
    var mysqlPool = mysql.createPool({
        host: config.get('db.mysql.host'),
        user: config.get('db.mysql.user'),
        password: config.get('db.mysql.pass'),
        connectionLimit: 5000,
        acquireTimeout: 500000,
        database: config.get('db.mysql.dbname')
    });
    var _this = this;
    mysqlPool.getConnection(function (err, connection) {
        if (err)
            throw err;
        _this.pconnection = connection;
    });
},
updateDb: function (tableName, data, cond, cb) {
    console.log('UPDATE ' + tableName + ' SET ? WHERE id=' + cond, data);
    this.pconnection.query('UPDATE ' + tableName + ' SET ? WHERE id=' + cond, data, function (err, res) {
        if (err)
            throw err;
        return cb(res);
    });
},
updateDbCustom: function (tableName, data, cond, cb) {
    console.log('UPDATE ' + tableName + ' SET ? WHERE ' + cond, data);
    this.pconnection.query('UPDATE ' + tableName + ' SET ? WHERE ' + cond, data, function (err, res) {
        if (err)
            throw err;
        return cb(res);
    });
},
deleteDb: function (tableName, data, cb) {
    this.pconnection.query('DELETE FROM ' + tableName + ' WHERE ' + data, function (err, res) {
        if (err)
            throw err;
        return cb(res);
    });
},
insertDb: function (tableName, data, cb) {
    console.log('INSERT INTO ' + tableName + ' SET ?', data);
    this.pconnection.query('INSERT INTO ' + tableName + ' SET ?', data, function (err, res) {
        if (err)
            throw err;
        return cb(res.insertId);
    });

},
selectDb: function (tableName, data, cb) {
    this.pconnection.query("SELECT * FROM " + tableName + " WHERE " + data, function (err, rows) {
        if (err)
            throw err;
        return cb(rows);
    });
},
selectCustomDb: function (query, cb) {
    this.pconnection.query(query, function (err, rows) {
        if (err)
            throw err;
        return cb(rows);
    });
},
asyncselectCustomDb: function (query) {
    var _this = this;
    console.log(query);
    return new Promise(function (result) {
        _this.pconnection.query(query, function (err, rows) {
            if (err)
                throw err;
            result(rows);
            ;
        });
    });
},
companySetup: function (data) {
    var _this = this;
    jsonfile.readFile('config/default_account.json', function (err, acc) {
        for (var k in acc) {
            var flag = (k == 'CASH') ? 'bank' : 'other';
            _this.insertDb('account', {company: data.cid, type: acc[k].type, flag: flag, tag: 'default', code: k, name: acc[k].name}, function (aid) {
                _this.insertDb('opening_balance', {account: aid, account_from: 'account', year: getFYear(new Date())}, function (oid) {});
            });
        }
    });
    _this.insertDb('settings', {company: data.cid}, function (oid) {});
},
openingBalanceFatch: function (data, cb) {
    var sql = "";
    if (data.type == 'customer')
        sql = "SELECT a.name,b.id,b.account,b.debit,b.credit FROM `customer` a INNER JOIN opening_balance b ON a.id=b.account WHERE b.year=" + data.year + " AND a.company=" + data.company + " AND b.account_from='customer' AND a.tag='customer'";
    else if (data.type == 'vendor')
        sql = "SELECT a.name,b.id,b.account,b.debit,b.credit FROM `customer` a INNER JOIN opening_balance b ON a.id=b.account WHERE b.year=" + data.year + " AND a.company=" + data.company + " AND b.account_from='customer' AND a.tag='vendor'";
    else
        sql = "SELECT a.name,b.id,b.account,b.debit,b.credit FROM `account` a INNER JOIN opening_balance b ON a.id=b.account WHERE b.year=" + data.year + " AND a.company=" + data.company + " AND b.account_from='account' ";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getSalesItem: function (data, cb) {
    var sql = "SELECT s.item,s.rate,i.name,i.unit,i.unit_two,i.unit_three,s.unit sunit,i.tax_slabe FROM `sales_item` s INNER JOIN item i ON i.id=s.item WHERE s.sales=" + data.sid;
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getPurchaseItem: function (data, cb) {
    var sql = "SELECT s.item,s.rate,i.name,i.unit,i.unit_two,i.unit_three,s.unit sunit,i.tax_slabe FROM `purchase_item` s INNER JOIN item i ON i.id=s.item WHERE s.purchase=" + data.sid;
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getCrnoteCust: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    var sql = "SELECT p.id,DATE_FORMAT(p.date,'%d, %b %Y') date,p.cr_note_no,p.total_amount,p.due_amount,p.payment_status,c.name,c.company_name FROM `cr_note` p INNER JOIN customer c ON c.id=p.customer WHERE 1 " + cnd;
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getDenoteCust: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    var sql = "SELECT p.id,DATE_FORMAT(p.date,'%d, %b %Y') date,p.de_note_no,p.total_amount,p.due_amount,p.payment_status,c.name,c.company_name FROM `de_note` p INNER JOIN customer c ON c.id=p.vendor WHERE 1 " + cnd;
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getPurchaseVen: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND p.status='" + data.status + "' ";
    }
    var sql = "SELECT p.id,DATE_FORMAT(p.bill_date,'%d, %b %Y') bill_date,DATE_FORMAT(DATE_ADD(p.bill_date, INTERVAL p.payment_due_date DAY),'%d, %b %Y') payment_due_date,p.bill_no,p.total_amount,p.due_amount,p.payment_status,c.name,c.company_name FROM `purchase` p INNER JOIN customer c ON c.id=p.customer WHERE 1 " + cnd;
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getSalesVen: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND s.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND s.status='" + data.status + "' ";
    }
    var sql = "SELECT s.id,DATE_FORMAT(s.bill_date,'%d, %b %Y') bill_date,DATE_FORMAT(DATE_ADD(s.bill_date, INTERVAL s.payment_date DAY),'%d, %b %Y') payment_date,s.invoice_no,s.total_amount,s.due_amount,s.payment_status,c.name,c.company_name FROM `sales` s INNER JOIN customer c ON c.id=s.customer WHERE 1 " + cnd + " ORDER BY s.id DESC";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
    getOfferVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND o.company=" + data.company;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (o.offer_no LIKE '%" + data.val + "%' OR o.total_amount LIKE '%" + data.val + "%' OR o.offer_status LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT o.id,o.enquiry,DATE_FORMAT(o.offer_date,'%d, %b %Y') offer_date,o.offer_no,o.total_amount,o.offer_status,c.name,c.company_name,e.offer_status as estatus FROM `offer` o INNER JOIN customer c ON c.id=o.customer INNER JOIN enquiry e ON o.enquiry = e.id where 1"+cnd+" ORDER BY o.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(o.id) tot FROM `offer` o INNER JOIN customer c ON c.id=o.customer INNER JOIN enquiry e ON o.enquiry = e.id where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getEnquiryVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND e.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND e.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (e.enquiry_validity LIKE '%" + data.val + "%'  OR e.enquiry_status LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%' OR e.enquiry_no LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT e.id,e.enquiry_status,e.enquiry_validity,e.enquiry_no,c.name,c.company_name FROM `enquiry` e INNER JOIN customer c ON c.id=e.customer where 1"+cnd+" ORDER BY e.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(e.id) tot FROM `enquiry` e INNER JOIN customer c ON c.id=e.customer where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getofferEnquiryVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND e.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND e.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (e.enquiry_no LIKE '%" + data.val + "%'  OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT e.id,c.name,c.company_name,e.enquiry_no FROM `enquiry` e INNER JOIN customer c ON c.id=e.customer where e.offer=0 AND e.offer_status='no' AND e.enquiry_status='accepted' AND 1"+cnd+" ORDER BY e.id DESC LIMIT "+data.start+","+data.tot;
    console.log("SELECT e.id,c.name,c.company_name,e.enquiry_no FROM `enquiry` e INNER JOIN customer c ON c.id=e.customer where e.offer=0 AND e.enquiry_status='accepted' AND 1"+cnd+" ORDER BY e.id DESC LIMIT "+data.start+","+data.tot);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(e.id) tot FROM `enquiry` e INNER JOIN customer c ON c.id=e.customer where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getworkorderVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND wo.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND wo.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (o.offer_no LIKE '%" + data.val + "%' OR wo.wo_no LIKE '%" + data.val + "%' OR wo.wo_status LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT wo.id,DATE_FORMAT(wo.wo_date,'%d, %b %Y') wo_date,wo.wo_no,wo.wo_status,c.name,c.company_name,o.offer_no FROM `workorder` wo INNER JOIN customer c ON c.id=wo.customer INNER JOIN offer o ON wo.offer=o.id  where 1"+cnd+" ORDER BY wo.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(wo.id) tot FROM `workorder` wo INNER JOIN customer c ON c.id=wo.customer INNER JOIN offer o ON wo.offer=o.id where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getPlanVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND p.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (p.plan_no LIKE '%" + data.val + "%' OR p.period_begin LIKE '%" + data.val + "%' OR p.period_end LIKE '%" + data.val + "%' OR p.plan_status LIKE '%" + data.val + "%' OR p.month LIKE '%" + data.val + "%' OR p.year LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT p.id,p.plan_no,p.period_begin,p.period_end,p.month,p.year,p.plan_status from plan p where 1"+cnd+" ORDER BY p.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(p.id) tot FROM `plan` p  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getMonthlyPlansheetVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND wo.company=" + data.company;
    }
    if (typeof data.wo_status != 'undefined') {
        cnd += " AND wo.wo_status='" + data.wo_status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (wo.wo_no LIKE '%" + data.val + "%' OR wi.planed LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%' OR cmd.size_id LIKE '%" + data.val + "%' OR cmd.moc LIKE '%" + data.val + "%' OR cmd.order_quantity LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT wo.id,wi.id wiid,wo.wo_no,wi.planed,wi.item,wi.quantity,cmd.size_id,cmd.moc,cmd.trim,cmd.ends,DATE_FORMAT(cmd.cdd,'%d, %b %Y') cdd,cmd.order_quantity,wi.quantity,c.name,c.company_name from workorder wo INNER JOIN workorder_item wi ON wo.id = wi.workorder INNER JOIN component_mapping_details cmd ON wi.item = cmd.item INNER JOIN customer c ON wo.customer=c.id  where 1"+cnd+" ORDER BY wo.id DESC LIMIT "+data.start+","+data.tot;
    console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(wo.id) tot FROM `workorder` wo INNER JOIN customer c ON c.id=wo.customer INNER JOIN workorder_item wi ON wo.id=wi.workorder INNER JOIN component_mapping_details cmd ON wi.item=cmd.item where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getAssetVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (asset_no LIKE '%" + data.val + "%'  OR asset_name LIKE '%" + data.val + "%'  OR asset_no LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT id,asset_no,asset_name,status FROM asset  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM asset  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
ckDuplicateCode:function(data,cb){
    var cnd='';
    console.log(data);
    if(typeof data.id!='undefined')
        cnd=' AND id<>'+data.id;
    var sql = "SELECT id FROM `item` WHERE status='active' and code='" + data.code.trim() + "'  "+ cnd;
    console.log(sql);
    this.selectCustomDb(sql, function (row) {
        if(row.length>0)
        return cb(false);
        else
            return cb(true);
    });
},
 getprodspecificationVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND pcs.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND pcs.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (pcs.specification_name LIKE '%" + data.val + "%' OR pcs.specification_no LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT pcs.id,pcs.specification_name,pcs.specification_no FROM prod_specification_category pcs  where 1"+cnd+" ORDER BY pcs.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(pcs.id) tot FROM `prod_specification_category` pcs where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getprodfeatureVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND pf.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND pf.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (pf.name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT pf.id,pf.name FROM product_feature pf  where 1"+cnd+" ORDER BY pf.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(pf.id) tot FROM `product_feature` pf where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getproditemspecificationVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.specification_id != 'undefined') {
        cnd += " AND psi.specification_id=" + data.specification_id;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND psi.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (psi.name LIKE '%" + data.val + "%' OR psi.code LIKE '%" + data.val + "%' OR psi.short_code LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT psi.id,psi.specification_id,psi.name,psi.code,psi.short_code FROM prod_specification_item psi  where 1"+cnd+" ORDER BY psi.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(psi.id) tot FROM `prod_specification_item` psi where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},

getsubfeatureVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.subfeatureid != 'undefined') {
        cnd += " AND prod_feature=" + data.subfeatureid;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (name LIKE '%" + data.val + "%'  ) ";
    }
    var sql = "SELECT id,prod_feature,name FROM product_sub_feature   where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM product_sub_feature  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getproditemcodificationVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND i.company='" + data.company + "' ";
    }
    if (typeof data.type != 'undefined') {
        cnd += " AND i.type='" + data.type + "' ";
    }
    if (typeof data.category != 'undefined') {
        cnd += " AND i.category='" + data.category + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND pc.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (i.code LIKE '%" + data.val + "%' OR i.name LIKE '%" + data.val + "%' OR i.specification LIKE '%" + data.val + "%' OR i.unit LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT pc.id,pc.prod_specification_category,pc.prod_specification_item,i.code as product_item_id,i.id as itemid,i.name,i.specification,i.unit,cmd.size_id FROM product_codification pc INNER JOIN item i ON pc.product_item_id = i.id LEFT JOIN component_mapping_details cmd ON cmd.item=i.id  where 1"+cnd+" GROUP BY pc.product_item_id ORDER BY pc.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(DISTINCT (pc.product_item_id)) tot FROM  product_codification pc INNER JOIN item i ON pc.product_item_id = i.id LEFT JOIN component_mapping_details cmd ON cmd.item=i.id where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getrawitemVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND i.company='" + data.company + "' ";
    }
    if (typeof data.type != 'undefined') {
        cnd += " AND i.type='" + data.type + "' ";
    }
    if (typeof data.category != 'undefined') {
        cnd += " AND i.category='" + data.category + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND i.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (i.code LIKE '%" + data.val + "%' OR i.name LIKE '%" + data.val + "%' OR i.specification LIKE '%" + data.val + "%' OR i.unit LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT i.id,i.code,i.name,i.specification,i.unit FROM item i where 1"+cnd+" ORDER BY i.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(DISTINCT (i.id)) tot FROM  item i  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getserviceitemVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND i.company='" + data.company + "' ";
    }
    if (typeof data.type != 'undefined') {
        cnd += " AND i.type='" + data.type + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND i.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (i.code LIKE '%" + data.val + "%' OR i.name LIKE '%" + data.val + "%' OR i.specification LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT i.id,i.code,i.name,i.specification FROM item i where 1"+cnd+" ORDER BY i.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(DISTINCT (i.id)) tot FROM  item i  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getsalesagentVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND sa.company='" + data.company + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND sa.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (sa.name LIKE '%" + data.val + "%' OR sa.display_name LIKE '%" + data.val + "%' OR sa.email LIKE '%" + data.val + "%' OR sa.ph_no LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT sa.id,sa.name,sa.display_name,sa.email,sa.ph_no FROM sales_agent sa where 1"+cnd+" ORDER BY sa.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(sa.id) tot FROM  sales_agent sa  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getcomponentcategoryVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND ccn.company='" + data.company + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND ccn.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (ccn.component_name LIKE '%" + data.val + "%' OR ccn.product_type LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT ccn.id,ccn.component_name,ccn.product_type FROM component_category_name ccn where 1"+cnd+" ORDER BY ccn.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(ccn.id) tot FROM  component_category_name ccn  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},

getsubcomponentcategoryVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.component_category_name != 'undefined') {
        cnd += " AND ccs.component_category_name='" + data.component_category_name + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND ccs.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (ccn.component_name LIKE '%" + data.val + "%' OR ccs.component_subname LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT ccs.id,ccn.product_type,ccn.component_name,ccs.component_subname FROM component_category_name ccn INNER JOIN component_category_subname ccs ON ccn.id = ccs.component_category_name where 1"+cnd+" ORDER BY ccs.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(ccs.id) tot FROM  component_category_subname ccs INNER JOIN component_category_name ccn ON ccn.id = ccs.component_category_name  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getunitVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND company='" + data.company + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (name LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT id,name FROM prod_unit  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM  prod_unit   where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
  });
},
getOfferEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(offer_date,'%m/%d/%Y') offer_date,amendment_no,amendment_date,offer_status,customer,offer_no,offer_note,offer_validity,total_amount,total_quantity,offer_term_note,sales_agent,tax,amount FROM `offer` WHERE id='" + data.id + "' ";
    //console.log("SELECT id,DATE_FORMAT(offer_date,'%m/%d/%Y') offer_date,amendment_no,amendment_date,offer_status,customer,offer_no,offer_note,offer_validity,total_amount,offer_term_note FROM `offer` WHERE id='" + data.id + "' ");
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.customer + "' ");
            arr.su=await _this.asyncselectCustomDb("SELECT id,name FROM `sales_agent`  WHERE id='"+sa.sales_agent+"'");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  customer='" + sa.customer + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT saf.account,saf.name,saf.id,saf.amount,sa.tax,sa.tax_amount,sa.amount samount FROM `sales_additional_fields` saf LEFT JOIN offer_aditional sa ON saf.id=sa.offer_additional AND sa.offer='" + data.id + "'");
            arr.otc=await _this.asyncselectCustomDb("SELECT otcf.name,otcf.id,otc.message FROM `offer_term_conditions_fields` otcf LEFT JOIN offer_term_conditions otc ON otcf.id=otc.offer_term_conditions AND otc.offer='" + data.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.sub_item,i.quantity,i.unit punit,i.rate,i.tax,i.discount,i.profit,i.final_amount,i.tax_amount,i.description,p.name,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three,p.code,cmd.size_id FROM `offer_item` i INNER JOIN item p ON p.id=i.item INNER JOIN component_mapping_details cmd ON p.id=cmd.item WHERE i.offer='" + data.id + "'");
            //arr.subitem =await _this.asyncselectCustomdb("SELECT * FROM sub_item WHERE item='"++"'");
            arr.img=await _this.asyncselectCustomDb("SELECT * FROM `document`  WHERE ref_id='" + sa.id + "' AND doc_type='offer' ");
            // console.log(arr);
            return cb(arr);
        });
    });
},
getEnquiryEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,enquiry_no,DATE_FORMAT(query_date,'%m/%d/%Y') query_date,customer,shipping, ref_no, enquiry_validity, currency, bank_guaranty, bank_guaranty_percentage, project_name, project_no, category, DATE_FORMAT(bid_opening_date,'%m/%d/%Y') bid_opening_date, earn_money, amount, status,sales_agent FROM enquiry WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus = await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.customer + "' ");
            arr.su = await _this.asyncselectCustomDb("SELECT id,name FROM `sales_agent`  WHERE status='active' AND company='" + data.company + "' ");
            arr.sp = await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  customer='" + sa.customer + "'");
            arr.img = await _this.asyncselectCustomDb("SELECT * FROM `document`  WHERE ref_id='" + sa.id + "' AND doc_type='enquiry' ");
            return cb(arr);
        });
    });
},
getworkorderEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,wo_no,DATE_FORMAT(wo_date,'%m/%d/%Y') wo_date, DATE_FORMAT(order_recived_date,'%m/%d/%Y') order_recived_date,DATE_FORMAT(order_date,'%m/%d/%Y') order_date,DATE_FORMAT(ach_date,'%m/%d/%Y') ach_date,DATE_FORMAT(circulated_date,'%m/%d/%Y') circulated_date,DATE_FORMAT(recived_date,'%m/%d/%Y') recived_date,DATE_FORMAT(over_all_cdd,'%m/%d/%Y') over_all_cdd ,order_type, mtc_issue_for, order_no,order_quantity,order_material_value,formal_order,pr_status,offer,customer,shipping FROM workorder WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.customer + "' ");
            arr.su=await _this.asyncselectCustomDb("SELECT id,offer_no FROM `offer`  WHERE  id='" + sa.offer + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  customer='" + sa.customer + "' ");
            arr.sac=await _this.asyncselectCustomDb("SELECT sa.id,sa.name,sac.amount FROM `sales_agent_credit` sac INNER JOIN sales_agent sa ON sa.id=sac.sales_agent  WHERE  sac.workorder='" + sa.id + "' ");
            arr.img=await _this.asyncselectCustomDb("SELECT * FROM `document`  WHERE ref_id='" + sa.id + "' AND doc_type='workorder' ");
            return cb(arr);
        });
    });
},
getOfferproductEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(offer_date,'%m/%d/%Y') offer_date,amendment_no,amendment_date,offer_status,customer,offer_no,offer_note,offer_validity,total_amount,offer_term_note FROM `offer` WHERE id='" + data.id + "' ";
   // console.log("SELECT id,DATE_FORMAT(offer_date,'%m/%d/%Y') offer_date,amendment_no,amendment_date,offer_status,customer,offer_no,offer_note,offer_validity,total_amount,offer_term_note FROM `offer` WHERE id='" + data.id + "' ");
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.customer + "' ");
            arr.su=await _this.asyncselectCustomDb("SELECT id,name FROM `sales_unit`  WHERE status='active' AND company='" + data.company + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  customer='" + sa.customer + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT saf.account,saf.name,saf.id,saf.amount,sa.tax,sa.tax_amount,sa.amount samount,sa.offer as ofrid FROM `sales_additional_fields` saf LEFT JOIN offer_aditional sa ON saf.id=sa.offer_additional AND sa.offer='" + data.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.offer as offerid,i.item_mapping_status,i.unit punit,i.rate,i.discount,i.profit,i.final_amount,i.tax as itax,i.tax_amount,i.description,p.name,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three,i.tax,cmd.size_id FROM `offer_item` i INNER JOIN item p ON p.id=i.item INNER JOIN component_mapping_details cmd ON p.id=cmd.item WHERE i.offer='" + data.id + "'");
            arr.newitem=await _this.asyncselectCustomDb("SELECT p.id,p.code,i.quantity,i.item_mapping_status,i.unit punit,i.rate,i.discount,i.profit,i.final_amount,i.tax_amount,i.tax,i.description,p.name,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three,cmd.size_id FROM `workorder_item` i INNER JOIN item p ON p.id=i.item INNER JOIN component_mapping_details cmd ON p.id=cmd.item WHERE i.offer='" + data.id + "' AND i.workorder='"+data.woid+"'");
            arr.newsaf=await _this.asyncselectCustomDb("SELECT saf.account,saf.name,saf.id,saf.amount,sa.tax,sa.tax_amount,sa.amount samount FROM `sales_additional_fields` saf LEFT JOIN workorder_aditional sa ON saf.id=sa.offer_additional AND sa.offer='" + data.id + "' AND sa.workorder='"+data.woid+"' ");
            arr.img=await _this.asyncselectCustomDb("SELECT * FROM `document`  WHERE ref_id='" + sa.id + "' AND doc_type='offer' ");
            // console.log(arr);
            return cb(arr);
        });
    });
},
getCommercialworkorder:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,wo_no,DATE_FORMAT(wo_date,'%m/%d/%Y') wo_date,DATE_FORMAT(over_all_cdd,'%m/%d/%Y') over_all_cdd, DATE_FORMAT(order_recived_date,'%m/%d/%Y') order_recived_date,DATE_FORMAT(order_date,'%m/%d/%Y') order_date,DATE_FORMAT(ach_date,'%m/%d/%Y') ach_date,DATE_FORMAT(circulated_date,'%m/%d/%Y') circulated_date,order_type, mtc_issue_for, order_no,order_quantity,order_material_value,formal_order,pr_status,offer,customer,shipping FROM workorder WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.customer + "' ");
            arr.su=await _this.asyncselectCustomDb("SELECT id,offer_no FROM `offer`  WHERE  id='" + sa.offer + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  customer='" + sa.customer + "' ");
            arr.sac=await _this.asyncselectCustomDb("SELECT sa.id,sac.amount ,sa.name as sales_agent FROM `sales_agent_credit` sac INNER JOIN sales_agent sa ON sac.sales_agent=sa.id WHERE sac.workorder='" + sa.id + "' ");
            arr.swoc=await _this.asyncselectCustomDb("SELECT * FROM `workorder_commercial`  WHERE  workorder='" + sa.id + "' ");
            return cb(arr);
        });
    });
},
getOfferDetails:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT * FROM `offer` WHERE offer_status='accepted' AND company='" + data.company+ "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            return cb(arr);
        });
    });
},

getBillOffer: function (data, cb) {
var sql = "SELECT o.id,o.offer_no,DATE_FORMAT(o.offer_date,'%d, %b %Y') offer_date,c.company_name,c.address,c.state,c.zip,c.city,c.gst,c.code,o.offer_term_note,o.total_amount,o.offer_note,e.offer_status FROM `offer` o INNER JOIN customer c on c.id = o.customer INNER JOIN enquiry e ON o.enquiry=e.id WHERE o.id='"+data.id+"'";
this.selectCustomDb(sql, function (row) {
    return cb(row);
  });
},
getBillTermsDetail: function(data, cb){
   var sql = "SELECT otcf.name,otcf.id,otc.message FROM offer_term_conditions_fields otcf INNER JOIN offer_term_conditions otc ON otcf.id=otc.offer_term_conditions WHERE otc.offer ='" + data.sid + "'   ";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},

getBillOfferDetail: function (data, cb) {
    var sql = "SELECT o.quantity,o.unit,o.rate,o.discount,o.tax_amount,o.tax,o.final_amount,i.code,i.name,i.hsn_code FROM `offer_item` o INNER JOIN item i ON i.id=o.item WHERE o.offer='" + data.sid + "'   ";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},

getBillOfferAdditional: function (data, cb) {
    var sql = "SELECT o.amount,o.tax,o.tax_amount,sa.name FROM `offer_aditional` o INNER JOIN sales_additional_fields sa ON sa.id=o.offer_additional WHERE o.offer='" + data.sid + "'   ";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getAssetEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,asset_no,asset_type,buying_price,status,asset_name FROM asset WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.img = await _this.asyncselectCustomDb("SELECT * FROM `document`  WHERE ref_id='" + sa.id + "' AND doc_type='asset' ");
            return cb(arr);
        });
    });
},
getAssettypeVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND company='" + data.company + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (name LIKE '%" + data.val + "%' OR type LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT id,name,type FROM assettype  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM  assettype  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getReceiveCus: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    var sql = "SELECT * FROM ((SELECT p.id,DATE_FORMAT(p.date,'%d, %b %Y') date,p.amount,c.name,c.company_name,a.name aname,p.transaction_type FROM `receive` p INNER JOIN customer c ON c.id=p.customer INNER JOIN account a ON a.id=p.account WHERE transaction_type='bill' " + cnd + " ) UNION (SELECT p.id,DATE_FORMAT(p.date,'%d, %b %Y') date,p.amount,'Expences' name,'' company_name,a.name aname,p.transaction_type FROM `receive` p  INNER JOIN account a ON a.id=p.account WHERE transaction_type='expence' " + cnd + ")) as tbl ORDER BY id DESC";
    
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getReceiveDeCus: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND j.company=" + data.company;
    }
    var sql = "SELECT * FROM ( (SELECT j.id,DATE_FORMAT(j.date,'%d, %b %Y') date,j.amount,c.name,c.company_name,a.name aname FROM `receive_de_note` j INNER JOIN customer c ON c.id=j.customer INNER JOIN account a ON a.id=j.account WHERE j.tag='receive' " + cnd + ") ";
    sql += "UNION (SELECT j.id,DATE_FORMAT(j.date,'%d, %b %Y') date,j.amount,c.name,c.company_name,'Adjust' aname FROM `receive_de_note` j INNER JOIN customer c ON c.id=j.customer  WHERE j.tag='adjust' " + cnd + ")  ) as tbl ORDER BY id DESC";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
ckDuplicateCustomerCompany:function(data,cb){
    var cnd='';
    console.log(data);
    if(typeof data.id!='undefined')
        cnd=' AND id<>'+data.id;
    var sql = "SELECT id FROM `customer` WHERE status='active' and company_name='" + data.company.trim() + "'  "+ cnd;
    console.log(sql);
    this.selectCustomDb(sql, function (row) {
        if(row.length>0)
        return cb(false);
        else
            return cb(true);
    });
},
getPayCrCus: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND j.company=" + data.company;
    }
    var sql = "SELECT * FROM ( (SELECT j.id,DATE_FORMAT(j.date,'%d, %b %Y') date,j.amount,c.name,c.company_name,a.name aname FROM `pay_cr_note` j INNER JOIN customer c ON c.id=j.customer INNER JOIN account a ON a.id=j.account WHERE j.tag='pay' " + cnd + ") ";
    sql += "UNION (SELECT j.id,DATE_FORMAT(j.date,'%d, %b %Y') date,j.amount,c.name,c.company_name,'Adjust' aname FROM `pay_cr_note` j INNER JOIN customer c ON c.id=j.customer  WHERE j.tag='adjust' " + cnd + ")  ) as tbl ORDER BY id DESC";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getTransferAcc: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND j.company=" + data.company;
    }
    var sql = "SELECT j.id,DATE_FORMAT(j.date,'%d, %b %Y') date,j.amount,c.name fname,a.name tname,j.amount FROM `transfer` j INNER JOIN account c ON c.id=j.from_account INNER JOIN account a ON a.id=j.to_account WHERE 1 " + cnd;
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
getPayCus: function (data, cb) {
    var cnd = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    var sql = "SELECT * FROM ((SELECT p.id,DATE_FORMAT(p.date,'%d, %b %Y') date,p.amount,c.name,c.company_name,a.name aname,p.transaction_type FROM `pay` p INNER JOIN customer c ON c.id=p.exp_cust_account INNER JOIN account a ON a.id=p.account WHERE transaction_type='bill' " + cnd + " ) UNION (SELECT p.id,DATE_FORMAT(p.date,'%d, %b %Y') date,p.amount,'Expences' name,'' company_name,a.name aname,p.transaction_type FROM `pay` p  INNER JOIN account a ON a.id=p.account WHERE transaction_type='expence' " + cnd + ")) as tbl ORDER BY id DESC";
    this.selectCustomDb(sql, function (row) {
        return cb(row);
    });
},
reportSalesOut: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT c.company_name cname,sum(total_amount) tamt,sum(due_amount) damt FROM `sales` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' GROUP BY c.id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportPurchaseOut: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT c.company_name cname,sum(total_amount) tamt,sum(due_amount) damt FROM `purchase` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' GROUP BY c.id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportSalesInv: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT c.company_name cname,total_amount tamt,due_amount damt,DATE_FORMAT(s.bill_date,'%d, %b %Y') bill_date,DATE_FORMAT(DATE_ADD(s.bill_date, INTERVAL s.payment_date DAY),'%d, %b %Y') payment_date,invoice_no FROM `sales` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' ";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportPurchaseInv: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT c.company_name cname,total_amount tamt,due_amount damt,DATE_FORMAT(s.bill_date,'%d, %b %Y') bill_date,DATE_FORMAT(DATE_ADD(s.bill_date, INTERVAL s.payment_due_date DAY),'%d, %b %Y') payment_date,bill_no invoice_no FROM `purchase` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' ";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportSalesOutAgeAna: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT DATEDIFF(CURDATE(),bill_date) odate,c.company_name cname,total_amount tamt,due_amount damt,invoice_no FROM `sales` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' ORDER BY c.id ";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportPurchaseOutAgeAna: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT DATEDIFF(CURDATE(),bill_date) odate,c.company_name cname,total_amount tamt,due_amount damt,bill_no invoice_no FROM `purchase` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' ORDER BY c.id ";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportSalesOutDet: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT c.company_name cname,total_amount tamt,due_amount damt,DATE_FORMAT(s.bill_date,'%d, %b %Y') bill_date,DATE_FORMAT(DATE_ADD(s.bill_date, INTERVAL s.payment_date DAY),'%d, %b %Y') payment_date,invoice_no FROM `sales` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' ORDER BY c.id ";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportPurchaseOutDet: function (data, cb) {
    if (typeof data.fdate != 'undefined' && data.fdate != '' && typeof data.tdate != 'undefined' && data.tdate != '') {
        var sql = "SELECT c.company_name cname,total_amount tamt,due_amount damt,DATE_FORMAT(s.bill_date,'%d, %b %Y') bill_date,DATE_FORMAT(DATE_ADD(s.bill_date, INTERVAL s.payment_due_date DAY),'%d, %b %Y') payment_date,bill_no invoice_no FROM `purchase` s INNER JOIN customer c on c.id=s.customer WHERE s.company='" + data.cid + "' AND s.payment_status<>'done' AND bill_date>'" + data.fdate + "' AND bill_date<'" + data.tdate + "' ORDER BY c.id ";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportplanningsummaryDet: function (data, cb) {
    if (typeof data.plan_year != 'undefined' && data.plan_year != '' && typeof data.plan_month != 'undefined' && data.plan_month != '' ) {
        var sql = "SELECT i.id as itmid,i.code as itmno,c.name as cus,o.offer_no,cmd.trim,cmd.moc,cmd.ends,cmd.inspection,DATE_FORMAT(cmd.cdd,'%d, %b %Y') cdd,DATE_FORMAT(w.wo_date,'%d, %b %Y') wo_date,cmd.size_id,wi.planed,p.plan_no,w.wo_no,wi.rate FROM plan_item pi INNER JOIN workorder_item wi ON pi.item = wi.item AND pi.workorder = wi.workorder INNER JOIN component_mapping_details cmd ON wi.item = cmd.item INNER JOIN plan p ON pi.plan = p.id INNER JOIN workorder w ON wi.workorder = w.id INNER JOIN item i ON i.id=wi.item INNER JOIN customer c ON c.id=w.customer INNER JOIN offer o ON w.offer = o.id WHERE pi.status <>'delete' AND p.year = '" + data.plan_year + "' AND p.month='" + data.plan_month + "'  ORDER BY cmd.size_id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportenquirybycusDet: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '' && typeof data.cus_name != 'undefined') {
        var sql = "SELECT e.enquiry_no,e.enquiry_validity,c.company_name, DATE_FORMAT(e.query_date,'%d, %b %Y') query_date,e.ref_no,c.company_name,sa.name FROM enquiry e INNER JOIN customer c ON e.customer = c.id INNER JOIN sales_agent sa ON sa.id = e.sales_agent WHERE e.status <>'delete' AND e.query_date>'" + data.frm_date + "' AND e.query_date<'" + data.to_date + "'  AND e.customer='"+data.cus_name+"' ORDER BY e.id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},

reportallenquiryDet: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '' ) {
       var cnd = '', _this = this,order_by=" c.company_name ASC,UNIX_TIMESTAMP(query_date) ASC ";
      //  var sql = "SELECT e.enquiry_no,c.company_name,e.enquiry_validity,c.company_name, DATE_FORMAT(e.query_date,'%d, %b %Y') query_date,e.ref_no,c.company_name,sa.name FROM enquiry e INNER JOIN customer c ON e.customer = c.id INNER JOIN sales_agent sa ON sa.id = e.sales_agent WHERE e.status <>'delete' AND e.query_date>'" + data.frm_date + "' AND e.query_date<'" + data.to_date + "' ORDER BY e.id";
        if (data.status != 'all')
            cnd += " AND enquiry_status='" + data.status + "' ";
        if (data.customer.length > 0)
            cnd += " AND c.id IN (" + data.customer.join() + ") ";
        var sql = "SELECT e.enquiry_no,c.company_name,e.enquiry_validity,c.company_name, DATE_FORMAT(e.query_date,'%d, %b %Y') query_date,e.ref_no,c.company_name,sa.name FROM enquiry e INNER JOIN customer c on c.id=e.customer INNER JOIN sales_agent sa ON sa.id = e.sales_agent WHERE e.status <>'delete' AND e.query_date>'" + data.frm_date + "' AND e.query_date<'" + data.to_date + "' "+ cnd +" ORDER BY "+order_by;
        this.selectCustomDb(sql, function (row) {
           return cb(row); 
        }); 
        } else {
        return cb([]);
        }  
},
reportofferDet: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '') {
        var sql = "SELECT o.id,o.offer_no,DATE_FORMAT(o.offer_date,'%d, %b %Y') offer_date,c.company_name,c.address,c.state,c.zip,c.city,c.gst,o.offer_term_note,t.slab,t.cgst,t.igst,t.sgst,o.total_amount,o.offer_note,oi.quantity,oi.unit,oi.rate,oi.discount,oi.tax_amount,oi.tax,oi.final_amount,i.code,i.specification,i.name,i.hsn_code,cmd.size_id FROM `offer` o INNER JOIN customer c on c.id = o.customer INNER JOIN tax_tran t ON t.tran_id=o.id INNER JOIN offer_item oi ON oi.offer = o.id INNER JOIN item i ON i.id = oi.item LEFT JOIN component_mapping_details cmd ON cmd.item = oi.item WHERE t.type='offer' AND o.status <>'delete' AND o.offer_date>'" + data.frm_date + "' AND o.offer_date<'" + data.to_date + "' ORDER BY o.id";
        //console.log(sql);
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportplancomponentDet: function (data, cb) {
    if (typeof data.plan_year != 'undefined' && data.plan_year != '' && typeof data.plan_month != 'undefined' && data.plan_month != '' && typeof data.comp_name != 'undefined' && data.comp_name != '') {
        var sql = "SELECT SUM(pi.plan_quantity) as planqnty,cm.prod_quantity,cmd.figure,cmd.size,cmd.trim,cmd.moc,cmd.ends,cmd.inspection,cmd.size_id,cm.drawing_no,i.code FROM plan_item pi INNER JOIN workorder_item wi ON pi.item = wi.item AND pi.workorder = wi.workorder INNER JOIN component_mapping_details cmd ON wi.item = cmd.item INNER JOIN plan p ON pi.plan = p.id INNER JOIN component_mapping cm ON pi.item = cm.item LEFT JOIN item i ON cm.product = i.id  WHERE pi.status <>'delete' AND p.year = '" + data.plan_year + "' AND p.month='" + data.plan_month + "' AND cm.component_feature = '" + data.comp_name + "' GROUP BY cmd.size_id  ORDER BY cmd.size_id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportallwoDate: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '' ) {
        var sql = "SELECT wo.wo_no,o.offer_no,c.company_name,c.company_name, DATE_FORMAT(wo.wo_date,'%d, %b %Y') wo_date,c.company_name FROM workorder wo INNER JOIN customer c ON wo.customer = c.id  INNER JOIN offer o ON o.id = wo.offer WHERE wo.status <>'delete' AND wo.wo_date>'" + data.frm_date + "' AND wo.wo_date<'" + data.to_date + "' ORDER BY wo.id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},

reportwobystatusDate: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '' && typeof data.wo_status != 'undefined') {
        var sql = "SELECT wo.wo_no,o.offer_no,c.company_name,c.company_name, DATE_FORMAT(wo.wo_date,'%d, %b %Y') wo_date,c.company_name FROM workorder wo INNER JOIN customer c ON wo.customer = c.id  INNER JOIN offer o ON o.id = wo.offer WHERE wo.status <>'delete' AND wo.wo_date>'" + data.frm_date + "' AND wo.wo_date<'" + data.to_date + "' AND wo.wo_status='"+data.wo_status+"' ORDER BY wo.id";
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
getprodcodedetails: function(data,cb){
    var item = [], _this = this;
    if (typeof data.code != 'undefined' && data.code != '') {
    var sql ="SELECT * FROM `product_codification` WHERE product_item_id='"+data.code+"'";
    this.selectCustomDb(sql, function (row) {
         var pending = row.length;
            if (row.length > 0) {
                var arr = [];
         row.forEach(async function (prodcode) {
                    //console.log(crnote);
                    var specificationcategoryitem = await _this.asyncselectCustomDb("SELECT * FROM `prod_specification_category` WHERE id='"+prodcode.prod_specification_category+"'");
                    var specificationitem = await _this.asyncselectCustomDb("SELECT * FROM `prod_specification_item` WHERE id='"+prodcode.prod_specification_item+"'");
                    if(specificationcategoryitem[0].specification_name == 'SIZE'){
                        arr.size = specificationitem[0].name;
                    }
                    if(specificationcategoryitem[0].specification_name == 'CLASS'){
                        arr.clas = specificationitem[0].name;
                        arr.clasc = specificationitem[0].code;
                    }
                    if(specificationcategoryitem[0].specification_name == 'BORE'){
                        arr.bore = specificationitem[0].code;
                    }
                    if(specificationcategoryitem[0].specification_name == 'SUB-TYPE'){
                        arr.stype = specificationitem[0].code;
                        arr.subtype = specificationitem[0].name;
                    }
                    if(specificationcategoryitem[0].specification_name == 'ENDS_IN'){
                        arr.ends = specificationitem[0].code;
                    }
                    if(specificationcategoryitem[0].specification_name == 'PR PARTS'){
                        arr.moc=specificationitem[0].code;
                    }
                    if(specificationcategoryitem[0].specification_name == 'TRIM PARTS'){
                        arr.trim=specificationitem[0].code;
                    }
                    if(specificationcategoryitem[0].specification_name == 'FORGING'){
                        arr.forg=specificationitem[0].code;
                    }
                    if(specificationcategoryitem[0].specification_name == 'JOINT'){
                        arr.joint=specificationitem[0].short_code;
                    }
                   //console.log(arr);
                   //console.log(arr.length);
                   //console.log(arr.size);
                   //console.log(item);
                  // if(arr.length > 0){
                   item.push(arr);
                  // }
                    if (0 === --pending) {
                        return cb(item);
                    }
                });
            } else {
                return cb(item);
            }
        });
    } else {
        return cb([]);
    }
},
reportalldepincomeDet: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' ) {
       var cnd = '', _this = this ,item = [];
      //  var sql = "SELECT e.enquiry_no,c.company_name,e.enquiry_validity,c.company_name, DATE_FORMAT(e.query_date,'%d, %b %Y') query_date,e.ref_no,c.company_name,sa.name FROM enquiry e INNER JOIN customer c ON e.customer = c.id INNER JOIN sales_agent sa ON sa.id = e.sales_agent WHERE e.status <>'delete' AND e.query_date>'" + data.frm_date + "' AND e.query_date<'" + data.to_date + "' ORDER BY e.id";
        if (data.aname.length > 0)
            cnd += " AND id in (" + data.aname + ")";
        var sql = "SELECT id,asset_no,asset_name,DATE_FORMAT(creation_date,'%d, %b %Y') start_date,asset_type,default_price FROM asset  WHERE status<>'delete' "+ cnd +" ORDER BY id DESC";
        this.selectCustomDb(sql, function (row) {
            var pending = row.length;
            if (row.length > 0) {
            row.forEach(async function (asst) {
               var arr = asst;
               var atype = await _this.asyncselectCustomDb("SELECT * FROM assettype WHERE type='depreciation' AND id='"+asst.asset_type+"'");
               var date = await _this.asyncselectCustomDb("SELECT DATE_FORMAT('" + data.frm_date + "','%d, %b %Y') date  ");
         if(atype.length > 0){
           // for(var i=0;i<atype.length;i++){
              var fdate = Math.floor(( Date.parse(date[0].date) - Date.parse(asst.start_date) ) / 86400000);
              var cal = (atype[0].incometax/100)*asst.default_price;
              var finalcal = (cal/365)*fdate
              arr.cdate = date[0].date;
              arr.fdate = fdate;
              arr.finalcal = finalcal;
              arr.itax = atype[0].incometax;
             //}
         }
         item.push(arr);
        if (0 === --pending) {
            console.log(item);
            return cb(item);
        }
     });
     }  else {
                return cb(item);
            }
        });
    } else {
        return cb([]);
    }


    
},
reportalldepcompanyDet: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' ) {
       var cnd = '', _this = this ,item = [];
      //  var sql = "SELECT e.enquiry_no,c.company_name,e.enquiry_validity,c.company_name, DATE_FORMAT(e.query_date,'%d, %b %Y') query_date,e.ref_no,c.company_name,sa.name FROM enquiry e INNER JOIN customer c ON e.customer = c.id INNER JOIN sales_agent sa ON sa.id = e.sales_agent WHERE e.status <>'delete' AND e.query_date>'" + data.frm_date + "' AND e.query_date<'" + data.to_date + "' ORDER BY e.id";
        if (data.aname.length > 0)
            cnd += " AND id in (" + data.aname + ")";
        var sql = "SELECT id,asset_no,asset_name,DATE_FORMAT(creation_date,'%d, %b %Y') start_date,asset_type,default_price FROM asset  WHERE status<>'delete' "+ cnd +" ORDER BY id DESC";
        this.selectCustomDb(sql, function (row) {
            var pending = row.length;
            if (row.length > 0) {
            row.forEach(async function (asst) {
               var arr = asst;
               var atype = await _this.asyncselectCustomDb("SELECT * FROM assettype WHERE type='depreciation' AND id='"+asst.asset_type+"'");
               var date = await _this.asyncselectCustomDb("SELECT DATE_FORMAT('" + data.frm_date + "','%d, %b %Y') date  ");
         if(atype.length > 0){
           // for(var i=0;i<atype.length;i++){
              var fdate = Math.floor(( Date.parse(date[0].date) - Date.parse(asst.start_date) ) / 86400000);
              var cal = (atype[0].companyact/100)*asst.default_price;
              var finalcal = (cal/365)*fdate
              arr.cdate = date[0].date;
              arr.fdate = fdate;
              arr.finalcal = finalcal;
              arr.itax = atype[0].companyact;
              
             //}
         }
         item.push(arr);
        if (0 === --pending) {
            console.log(item);
            return cb(item);
        }
     });
     }  else {
                return cb(item);
            }
        });
    } else {
        return cb([]);
    }  
},
getAssetPartnerVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (name LIKE '%" + data.val + "%'  OR email LIKE '%" + data.val + "%'  OR phno LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT id,name,phno,email,img,address FROM asset_partner  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM asset_partner  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},

getAssetlocationVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (label LIKE '%" + data.val + "%'  OR city LIKE '%" + data.val + "%'  OR state LIKE '%" + data.val + "%' OR country LIKE '%" + data.val + "%' OR zip LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT id,label,address,city,state,country,zip FROM asset_location  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM asset_location  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getAcureAssetVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND ai.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND ai.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (ai.asset_validity LIKE '%" + data.val + "%'  OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT ai.id,aii.id as aiid,DATE_FORMAT(ai.date,'%d, %b %Y') asset_date,ai.asset_validity,c.name,c.company_name,a.asset_name,aii.rate,att.useful_life FROM asset_info ai INNER JOIN customer c ON c.id=ai.vendor INNER JOIN asset_item aii ON aii.asset_info = ai.id INNER JOIN asset a ON aii.asset = a.id LEFT JOIN assettype att ON a.asset_type = att.id  where 1"+cnd+" ORDER BY ai.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(ai.id) tot FROM asset_info ai INNER JOIN customer c ON c.id=ai.vendor INNER JOIN asset_item aii ON aii.asset_info = ai.id INNER JOIN asset a ON aii.asset = a.id LEFT JOIN assettype att ON a.asset_type = att.id  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getAcureAssetEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(date,'%m/%d/%Y') date,date as pdate,creation_date,location,asset_note,vendor,asset_doc FROM `asset_info` WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.vendor + "' ");
            arr.item=await _this.asyncselectCustomDb("SELECT a.id,ai.id as aiid,ai.quantity,ai.rate,ai.final_amount,ai.shift,a.asset_name,a.asset_no,ast.useful_life as ulife FROM `asset_item` ai INNER JOIN asset a ON a.id=ai.asset LEFT JOIN assettype ast ON a.asset_type = ast.id WHERE ai.asset_info='" + data.id + "'");
            arr.loc=await _this.asyncselectCustomDb("SELECT * FROM `asset_location`  WHERE id='" + sa.location + "' ");
            return cb(arr);
        });
    });
},
getIssueAssetVen: function (data, cb) {
    var cnd = "",_this=this,tbl = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND ai.company=" + data.company;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND ( c.name LIKE '%" + data.val + "%' OR ai.id LIKE '%" + data.val + "%') ";
    }
    if(typeof data.ttype != 'undefined' && data.ttype =='customer'){
        tbl += "customer";
    }
    else{
       tbl += "asset_partner"; 
    }

    var sql = "SELECT ai.id,DATE_FORMAT(ai.issue_date,'%d, %b %Y') issue_date,c.name FROM issue_asset ai INNER JOIN "+ tbl +" c ON c.id=ai.partner   where 1"+cnd+" ORDER BY ai.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(ai.id) tot FROM return_asset ai INNER JOIN "+ tbl +" c ON c.id=ai.partner  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getIssueAssetEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(issue_date,'%m/%d/%Y') date,partner,remark FROM `issue_asset` WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.partner + "' ");
            arr.item=await _this.asyncselectCustomDb("SELECT a.id,ai.quantity,a.asset_name,a.asset_no FROM `issue_asset_item` ai INNER JOIN asset a ON a.id=ai.asset WHERE ai.issue_asset='" + data.id + "'");
            return cb(arr);
        });
    });
},
getReturnAssetVen: function (data, cb) {
    var cnd = "",_this=this,tbl = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND ai.company=" + data.company;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND ( c.name LIKE '%" + data.val + "%' OR ai.id LIKE '%" + data.val + "%' ) ";
    }
    if(typeof data.ttype != 'undefined' && data.ttype =='customer'){
        tbl += "customer";
    }
    else{
       tbl += "asset_partner"; 
    }

    var sql = "SELECT ai.id,DATE_FORMAT(ai.return_date,'%d, %b %Y') return_date,c.name FROM return_asset ai INNER JOIN "+ tbl +" c ON c.id=ai.partner   where 1"+cnd+" ORDER BY ai.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(ai.id) tot FROM return_asset ai INNER JOIN "+ tbl +" c ON c.id=ai.partner  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getReturnAssetEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(return_date,'%m/%d/%Y') date,partner,remark FROM `return_asset` WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.partner + "' ");
            arr.item=await _this.asyncselectCustomDb("SELECT a.id,ai.quantity,a.asset_name,a.asset_no FROM `return_asset_item` ai INNER JOIN asset a ON a.id=ai.asset WHERE ai.return_asset='" + data.id + "'");
            return cb(arr);
        });
    });
},
/*getReqPlanVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND p.status='" + data.status + "' AND pi.status='"+data.status+"' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (p.plan_no LIKE '%" + data.val + "%' OR i.code LIKE '%" + data.val + "%' OR cmd.size_id LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT pi.id,p.id as planid,i.id as itemid,pi.plan_quantity as quantity,pi.plan_status,p.plan_no,i.code,i.specification,cm.prod_quantity as cmqnty,i.current_stock,iis.quantity as total_qnty,cmd.size_id,cm.product,it.code as rawcode,it.current_stock as rawstock FROM `plan_item` pi INNER JOIN item i ON pi.item=i.id INNER JOIN plan p ON p.id=pi.plan LEFT JOIN item_stock iis ON i.id = iis.item INNER JOIN component_mapping_details cmd ON cmd.item=i.id LEFT JOIN component_mapping cm ON cm.item = i.id LEFT JOIN item it ON it.id = cm.product where 1"+cnd+" ORDER BY p.id DESC LIMIT "+data.start+","+data.tot;
    console.log(sql);
    this.selectCustomDb(sql, function (row) { 
      sql = "SELECT count(pi.id) tot FROM `plan_item` pi INNER JOIN item i ON pi.item=i.id INNER JOIN plan p ON p.id=pi.plan LEFT JOIN item_stock iis ON i.id = iis.item INNER JOIN component_mapping_details cmd ON cmd.item=i.id LEFT JOIN component_mapping cm ON cm.item = i.id LEFT JOIN item it ON it.id = cm.product  where 1"+cnd;
    _this.selectCustomDb(sql, function (tot) {
      // console.log(arr);
        return cb([row,tot]);
    });
    });
},*/
getReqPlanVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND p.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND p.status='" + data.status + "' AND pi.status='"+data.status+"' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (p.plan_no LIKE '%" + data.val + "%' OR i.code LIKE '%" + data.val + "%' OR cmd.size_id LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT pi.id,p.id as planid,i.id as itemid,it.id as rawid,pi.plan_quantity as quantity,pi.plan_status,p.plan_no,i.code,i.specification,cm.prod_quantity as cmqnty,i.current_stock,iis.quantity as total_qnty,cmd.size_id,cm.product,it.code as rawcode,it.current_stock as rawstock,spl.quantity as finalqnty FROM `plan_item` pi INNER JOIN item i ON pi.item=i.id INNER JOIN plan p ON p.id=pi.plan LEFT JOIN item_stock iis ON i.id = iis.item INNER JOIN component_mapping_details cmd ON cmd.item=i.id LEFT JOIN component_mapping cm ON cm.item = i.id LEFT JOIN item it ON it.id = cm.product LEFT JOIN send_plan_list spl ON i.id=spl.item AND p.id=spl.plan AND it.id=spl.rawitem where 1"+cnd+" ORDER BY pi.id DESC ";
    console.log(sql);
    this.selectCustomDb(sql, function (row) { 
       //console.log(row);
       return cb([row]);
    });
},
getReqPurchaseVen: function(data, cb) {
 var cnd = "",_this=this,tbl = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND spl.company=" + data.company;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND ( i.code LIKE '%" + data.val + "%' OR spl.quantity LIKE '%" + data.val + "%' OR spl.id LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT SUM(spl.quantity) tot,i.name,i.code,spl.rawitem,DATE_FORMAT(spl.creation_date,'%d, %b %Y') date FROM send_plan_list spl INNER JOIN item i ON spl.rawitem=i.id where 1"+cnd+" GROUP BY rawitem ORDER BY spl.id DESC LIMIT "+data.start+","+data.tot;
    console.log(sql);
    this.selectCustomDb(sql, function (row) {
       
        sql = "SELECT COUNT(DISTINCT spl.rawitem) tot FROM send_plan_list spl INNER JOIN item i ON spl.rawitem=i.id where 1"+cnd;
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });

},
/*getReqDetailsPurchaseVen: function(data, cb) {
 var cnd = "",_this=this,tbl = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND spl.company=" + data.company;
    }
    if (typeof data.rawitm != 'undefined') {
        cnd += " AND spl.rawitem=" + data.rawitm;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND ( i.code LIKE '%" + data.val + "%' OR spl.quantity LIKE '%" + data.val + "%' OR spl.id LIKE '%" + data.val + "%' OR it.code LIKE '%" + data.val + "%' OR p.plan_no LIKE '%" + data.val + "%' ) ";
    }
    var sql = "SELECT spl.id,spl.quantity,i.code as itemcode,it.code as rawitemcode,p.plan_no,DATE_FORMAT(spl.creation_date,'%d, %b %Y') date FROM send_plan_list spl INNER JOIN item i ON spl.item=i.id INNER JOIN plan p ON spl.plan=p.id INNER JOIN item it ON spl.rawitem=it.id where 1"+cnd+" ORDER BY spl.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
       
        sql = "SELECT COUNT(spl.id) tot FROM send_plan_list spl INNER JOIN item i ON spl.item=i.id INNER JOIN plan p ON spl.plan=p.id INNER JOIN item it ON spl.rawitem=it.id where 1"+cnd;
        
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });

},*/
getReqDetailsPurchaseVen: function(data, cb) {
 var cnd = "",_this=this,tbl = "";
    if (typeof data.company != 'undefined') {
        cnd += " AND spl.company=" + data.company;
    }
    if (typeof data.rawitm != 'undefined') {
        cnd += " AND spl.rawitem=" + data.rawitm;
    }
    var sql = "SELECT spl.id,spl.quantity,i.code as itemcode,it.code as rawitemcode,p.plan_no,DATE_FORMAT(spl.creation_date,'%d, %b %Y') date FROM send_plan_list spl INNER JOIN item i ON spl.item=i.id INNER JOIN plan p ON spl.plan=p.id INNER JOIN item it ON spl.rawitem=it.id where 1"+cnd+" ORDER BY spl.id DESC ";
    console.log(sql);
    this.selectCustomDb(sql, function (row) {
       
        
        return cb([row]);
    });

},
getPurchaseEnquiryVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND pei.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND pei.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (pei.enquiry_no LIKE '%" + data.val + "%' OR pei.total_amount LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT pei.id,DATE_FORMAT(pei.date,'%d, %b %Y') date,DATE_FORMAT(pei.submission_date,'%d, %b %Y') submission_date,pei.enquiry_no,pei.total_amount,c.name,c.company_name FROM purchase_enquiry pei INNER JOIN customer c ON c.id=pei.vendor where 1"+cnd+" ORDER BY pei.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(pei.id) tot FROM purchase_enquiry pei INNER JOIN customer c ON c.id=pei.vendor where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getPurchaseEnquiryEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(date,'%m/%d/%Y') enquiry_date,DATE_FORMAT(submission_date,'%m/%d/%Y') submission_date,DATE_FORMAT(expected_delivery_date,'%m/%d/%Y') expected_delivery_date,shipping,vendor,enquiry_no,enquiry_note,drawing_no,enquiry_terms,total_amount FROM purchase_enquiry WHERE id='" + data.id + "' ";
    console.log("SELECT id,DATE_FORMAT(date,'%m/%d/%Y') enquiry_date,DATE_FORMAT(submission_date,'%m/%d/%Y') submission_date,DATE_FORMAT(expected_delivery_date,'%m/%d/%Y') expected_delivery_date,shipping,vendor,enquiry_no,enquiry_note,drawing_no,enquiry_terms,total_amount FROM purchase_enquiry WHERE id='" + data.id + "' ");
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE FIND_IN_SET(id,'" + sa.vendor + "') ");
            arr.su=await _this.asyncselectCustomDb("SELECT id,name FROM `sales_unit`  WHERE status='active' AND company='" + data.company + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  customer='" + sa.vendor + "' ");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.unit punit,i.rate,i.tax,i.final_amount,i.tax_amount,i.description,p.code,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three FROM `purchase_enquiry_item` i INNER JOIN item p ON p.id=i.item WHERE i.purchase_enquiry='" + data.id + "'");
          //  arr.img=await _this.asyncselectCustomDb("SELECT * FROM `document`  WHERE ref_id='" + sa.id + "' AND doc_type='offer' ");
             console.log(arr);
            return cb(arr);
        });
    });
},
gethydrotestVen: function (data, cb) {
    var cnd = "",_this=this;
    
    if (typeof data.company != 'undefined') {
        cnd += " AND company='" + data.company + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (class LIKE '%" + data.val + "%' OR body LIKE '%" + data.val + "%' OR seat LIKE '%" + data.val + "%' OR back_seat LIKE '%" + data.val + "%' OR seat_air LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT id,class,body,seat,back_seat,seat_air FROM hydro_test  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM  hydro_test   where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
 getPriceCompetitiveVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND pc.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND pc.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (pe.enquiry_no LIKE '%" + data.val + "%' OR pc.total_amount LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT pc.id,DATE_FORMAT(pc.date,'%d, %b %Y') date,pc.enquiry,pc.total_amount,pe.enquiry_no as enquiry,c.name,c.company_name FROM price_competitive pc INNER JOIN customer c ON c.id=pc.vendor INNER JOIN purchase_enquiry pe ON pc.enquiry = pe.id where 1"+cnd+" ORDER BY pc.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(pc.id) tot FROM price_competitive pc INNER JOIN customer c ON c.id=pc.vendor INNER JOIN purchase_enquiry pe ON pc.enquiry = pe.id where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getPriceCompetitiveEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(date,'%m/%d/%Y') date,vendor,enquiry,note,total_amount FROM price_competitive WHERE id='" + data.id + "' ";
    console.log("SELECT id,DATE_FORMAT(date,'%m/%d/%Y') date,vendor,enquiry,note,total_amount FROM price_competitive WHERE id='" + data.id + "' ");
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.vendor + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  id='" + arr.cus[0].default_shipping + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT paf.account,paf.name,paf.id,paf.amount,pa.tax,pa.tax_amount,pa.amount samount FROM purchase_additional_fields paf LEFT JOIN purchase_additional pa ON paf.id=pa.price_competitive_additional AND pa.price_competitive='" + data.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.unit punit,i.rate,i.tax,i.final_amount,i.tax_amount,p.code,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three FROM `price_competitive_item` i INNER JOIN item p ON p.id=i.item WHERE i.price_competitive='" + data.id + "'");
            return cb(arr);
        });
    });
},
 getForgingVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT id,name FROM forging  where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM forging where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getPurchaseOrderDetails:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT pc.vendor,pc.enquiry,pc.note,pe.enquiry_no FROM price_competitive pc INNER JOIN purchase_enquiry pe ON pc.enquiry = pe.id WHERE pc.id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.vendor + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  id='" + arr.cus[0].default_shipping + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT paf.account,paf.name,paf.id,paf.amount,pa.tax,pa.tax_amount,pa.amount samount FROM purchase_additional_fields paf LEFT JOIN purchase_additional pa ON paf.id=pa.price_competitive_additional AND pa.price_competitive='" + data.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.unit punit,i.rate,i.tax,i.final_amount,i.tax_amount,p.code,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three FROM `price_competitive_item` i INNER JOIN item p ON p.id=i.item WHERE i.price_competitive='" + data.id + "'");
            return cb(arr);
        });
    });
},
getNewPurchaseOrderDetails:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT po.id,po.po_no as pono,DATE_FORMAT(po.po_date,'%m/%d/%Y') date,po.vendor,po.purchase_enquiry enquiry,po.total_amount,pe.enquiry_no FROM purchase_order po INNER JOIN purchase_enquiry pe ON po.purchase_enquiry = pe.id WHERE po.price_competitive='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.vendor + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  id='" + arr.cus[0].default_shipping + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT paf.account,paf.name,paf.id,paf.amount,pa.tax,pa.tax_amount,pa.amount samount FROM purchase_additional_fields paf LEFT JOIN purchase_order_additional pa ON paf.id=pa.purchase_order_additional AND pa.purchase_order='" + sa.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.unit punit,i.rate,i.tax,i.final_amount,i.tax_amount,p.code,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three FROM `purchase_order_item` i INNER JOIN item p ON p.id=i.item WHERE i.purchase_order='" + sa.id + "'");
            return cb(arr);
        });
    });
},
getPurchaseOrderVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND po.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND po.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (po.po_no LIKE '%" + data.val + "%' OR pe.enquiry_no LIKE '%" + data.val + "%' OR po.total_amount LIKE '%" + data.val + "%' OR c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT po.id,po.po_no,DATE_FORMAT(po.po_date,'%d, %b %Y') date,po.purchase_enquiry,po.total_amount,pe.enquiry_no as enquiry,c.name,c.company_name FROM purchase_order po INNER JOIN customer c ON c.id=po.vendor LEFT JOIN purchase_enquiry pe ON po.purchase_enquiry = pe.id where 1"+cnd+" ORDER BY po.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(po.id) tot FROM purchase_order po INNER JOIN customer c ON c.id=po.vendor INNER JOIN purchase_enquiry pe ON po.purchase_enquiry = pe.id where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getPoDetails:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT pc.id,pc.vendor,pc.enquiry,pc.note,pe.enquiry_no FROM price_competitive pc INNER JOIN purchase_enquiry pe ON pc.enquiry = pe.id WHERE pc.enquiry='" + data.id + "' AND pc.vendor='" +data.vendor+ "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.vendor + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  id='" + arr.cus[0].default_shipping + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT paf.account,paf.name,paf.id,paf.amount,pa.tax,pa.tax_amount,pa.amount samount FROM purchase_additional_fields paf LEFT JOIN purchase_additional pa ON paf.id=pa.price_competitive_additional AND pa.price_competitive='" + sa.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.unit punit,i.rate,i.tax,i.final_amount,i.tax_amount,p.code,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three FROM `price_competitive_item` i INNER JOIN item p ON p.id=i.item WHERE i.price_competitive='" + sa.id + "'");
            return cb(arr);
        });
    });
},
getCusDetails:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT * FROM customer WHERE id='" +data.vendor+ "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  id='" + sa.default_shipping + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT account,name,id,amount FROM purchase_additional_fields ");
            return cb(arr);
        });
    });
},
getPurchaseOrderEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT po.id,po.po_no as pono,DATE_FORMAT(po.po_date,'%m/%d/%Y') date,po.price_competitive,po.vendor,po.purchase_enquiry as enquiry,po.total_amount,po.note,pe.enquiry_no FROM purchase_order po LEFT JOIN purchase_enquiry pe ON po.purchase_enquiry = pe.id WHERE po.id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.vendor + "' ");
            arr.sp=await _this.asyncselectCustomDb("SELECT id,label,state FROM `customer_shipping`  WHERE  id='" + arr.cus[0].default_shipping + "' ");
            arr.saf=await _this.asyncselectCustomDb("SELECT paf.account,paf.name,paf.id,paf.amount,pa.tax,pa.tax_amount,pa.amount samount FROM purchase_additional_fields paf LEFT JOIN purchase_order_additional pa ON paf.id=pa.purchase_order_additional AND pa.purchase_order='" + sa.id + "'");
            arr.item=await _this.asyncselectCustomDb("SELECT p.id,i.quantity,i.unit punit,i.rate,i.tax,i.final_amount,i.tax_amount,p.code,p.hsn_code,p.specification,p.tax_slabe,p.unit,p.unit_two,p.unit_three FROM `purchase_order_item` i INNER JOIN item p ON p.id=i.item WHERE i.purchase_order='" + sa.id + "'");
            return cb(arr);
        });
    });
},
getSpecialCompVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND company=" + data.company;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (name LIKE '%" + data.val + "%' OR size LIKE '%" + data.val + "%' OR unit_description LIKE '%" + data.val + "%' OR type LIKE '%" + data.val + "%' OR saf_no LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT id,name,size,unit_description,type,saf_no FROM special_component where 1"+cnd+" ORDER BY id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(id) tot FROM special_component where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getofferMappingVen:function(data,cb){
    var arr={},cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND o.company=" + data.company;
    }
    if (typeof data.id != 'undefined') {
        cnd += " AND o.id=" + data.id;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (i.code LIKE '%" + data.val + "%' OR cmd.size_id LIKE '%" + data.val + "%' OR oi.description LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT o.id,i.id as itmid,i.code,cmd.size_id,i.description,oi.description as desp,oi.item_mapping_status,oi.sub_item FROM offer o INNER JOIN offer_item oi ON o.id=oi.offer INNER JOIN item i ON oi.item=i.id INNER JOIN component_mapping_details cmd ON cmd.item=i.id WHERE 1"+cnd+" ORDER BY oi.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(oi.id) tot FROM offer o INNER JOIN offer_item oi ON o.id=oi.offer INNER JOIN item i ON oi.item=i.id INNER JOIN component_mapping_details cmd ON cmd.item=i.id where 1"+cnd;
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
      });
    });
},
getMappingdetailsByItemId:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT cm.id,cm.item,cm.prod_quantity,ccn.id as ccnid,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname FROM component_mapping cm INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature WHERE cm.item='" + data.code + "' ";
    this.selectCustomDb(sql, function (row) {
      return cb(row);
  });
},
newMappingdetailsByItemId:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT csm.id as imid,csm.material,i.code,i.hsn_code,cm.id,cm.item,cm.prod_quantity,ccn.id as ccnid,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname FROM component_sub_mapping csm INNER JOIN component_mapping cm ON csm.component_mapping = cm.id INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature LEFT JOIN item i ON csm.material = i.id WHERE csm.item='"+data.itm+"' AND csm.sub_item='" + data.subitm + "'";
    console.log(sql);
    this.selectCustomDb(sql, function (row) {
      return cb(row);
  });
},
getWOMappingVen:function(data,cb){
    var arr={},cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND w.company=" + data.company;
    }
    if (typeof data.id != 'undefined') {
        cnd += " AND w.id=" + data.id;
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (i.code LIKE '%" + data.val + "%' OR cmd.size_id LIKE '%" + data.val + "%' OR wi.description LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT w.id,w.offer,i.id as itmid,i.code,cmd.size_id,i.description,wi.description as desp,wi.item_mapping_status FROM workorder w INNER JOIN workorder_item wi ON w.id=wi.workorder INNER JOIN item i ON wi.item=i.id INNER JOIN component_mapping_details cmd ON cmd.item=i.id WHERE 1"+cnd+" ORDER BY wi.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(wi.id) tot FROM workorder w INNER JOIN workorder_item wi ON w.id=wi.workorder INNER JOIN item i ON wi.item=i.id INNER JOIN component_mapping_details cmd ON cmd.item=i.id where 1"+cnd;
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
   });
 });
},
getWoMappingdetailsByItemId:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT cm.id,cm.item,cm.prod_quantity,ccn.id as ccnid,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname FROM component_mapping cm INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature WHERE cm.item='" + data.code + "' ";
    this.selectCustomDb(sql, function (row) {
      return cb(row);
  });
},
newWoMappingdetailsByItemId:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT im.id as imid,im.material,i.code,i.hsn_code,cm.id,cm.item,cm.prod_quantity,ccn.id as ccnid,ccn.component_name,pf.id as pfid,pf.name as pfname ,psf.id as psfid,psf.name as psfname FROM item_mapping im INNER JOIN component_mapping cm ON im.component_mapping = cm.id INNER JOIN component_category_name ccn ON cm.component = ccn.id INNER JOIN product_feature pf ON cm.component_feature = pf.id LEFT JOIN product_sub_feature psf ON psf.id = cm.component_sub_feature LEFT JOIN item i ON im.material = i.id WHERE im.item='"+data.itm+"' AND im.offer='" + data.ofr + "'";
    this.selectCustomDb(sql, function (row) {
      return cb(row);
  });
},
reportallpoDet: function (data, cb) {
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '' ) {
       var cnd = '', _this = this,order_by=" c.company_name ASC,UNIX_TIMESTAMP(po_date) ASC ";
      //  var sql = "SELECT e.enquiry_no,c.company_name,e.enquiry_validity,c.company_name, DATE_FORMAT(e.query_date,'%d, %b %Y') query_date,e.ref_no,c.company_name,sa.name FROM enquiry e INNER JOIN customer c ON e.customer = c.id INNER JOIN sales_agent sa ON sa.id = e.sales_agent WHERE e.status <>'delete' AND e.query_date>'" + data.frm_date + "' AND e.query_date<'" + data.to_date + "' ORDER BY e.id";
        if (data.status != 'all')
            cnd += " AND po_status='" + data.status + "' ";
        if (data.customer.length > 0)
            cnd += " AND c.id IN (" + data.customer.join() + ") ";
        var sql = "SELECT po.po_no,c.company_name, DATE_FORMAT(po.po_date,'%d, %b %Y') po_date,c.company_name,po.total_amount,pe.enquiry_no FROM purchase_order po INNER JOIN customer c on c.id=po.vendor LEFT JOIN purchase_enquiry pe ON pe.id = po.purchase_enquiry WHERE po.status <>'delete' AND po.po_date>'" + data.frm_date + "' AND po.po_date<'" + data.to_date + "' "+ cnd +" ORDER BY "+order_by;
        this.selectCustomDb(sql, function (row) {
           return cb(row); 
        }); 
        } else {
        return cb([]);
        }
},
reportpoDetByItem: function (data, cb) {
    var arr={};
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '') {
        var cnd = '', _this = this,order_by=" c.company_name ASC,UNIX_TIMESTAMP(po_date) ASC ";
        if (data.status != 'all')
            cnd += " AND po_status='" + data.status + "' ";
        if (data.customer.length > 0)
            cnd += " AND c.id IN (" + data.customer.join() + ") ";
        var sql = "SELECT po.id,po.po_no,DATE_FORMAT(po.po_date,'%d, %b %Y') po_date,c.company_name,c.address,c.state,c.zip,c.city,c.gst,po.total_amount,poi.quantity,poi.unit,poi.rate,poi.tax_amount,poi.tax,poi.final_amount,i.code,i.specification,i.name,i.hsn_code ,pe.enquiry_no FROM purchase_order po INNER JOIN customer c on c.id = po.vendor  INNER JOIN purchase_order_item poi ON poi.purchase_order = po.id INNER JOIN item i ON i.id = poi.item LEFT JOIN purchase_enquiry pe ON po.purchase_enquiry = pe.id WHERE  po.status <>'delete' AND po.po_date>'" + data.frm_date + "' AND po.po_date<'" + data.to_date + "' "+ cnd +" ORDER BY "+order_by;
        //console.log(sql);
        this.selectCustomDb(sql, function (row) {
        /*row.forEach(async function (sa) {
           var arr = sa;
           var saf = await _this.asyncselectCustomDb("SELECT SUM(amount) amount FROM purchase_order_additional WHERE purchase_order='" + sa.id + "' ");
                arr.adtax = saf[0].amount
            return cb(arr);
        });*/
        return cb(row);
        });
    } else {
        return cb([]);
    }
},
reportpoAdditional: function (data, cb) {
    var arr={};
    if (typeof data.frm_date != 'undefined' && data.frm_date != '' && typeof data.to_date != 'undefined' && data.to_date != '') {
        var cnd = '', _this = this,order_by=" c.company_name ASC,UNIX_TIMESTAMP(po_date) ASC ";
        if (data.status != 'all')
            cnd += " AND po_status='" + data.status + "' ";
        if (data.customer.length > 0)
            cnd += " AND c.id IN (" + data.customer.join() + ") ";
        var sql = "SELECT SUM(pod.amount) as samount FROM purchase_order po INNER JOIN customer c on c.id = po.vendor LEFT JOIN purchase_order_additional pod ON pod.purchase_order = po.id WHERE  po.status <>'delete' AND po.po_date>'" + data.frm_date + "' AND po.po_date<'" + data.to_date + "' "+ cnd +" ORDER BY "+order_by;
        console.log(sql);
        this.selectCustomDb(sql, function (row) {
            return cb(row);
        });
    } else {
        return cb([]);
    }
},
getsubcodificationVen: function(data, cb) {
    var cnd = "",_this=this;
    if (typeof data.item != 'undefined') {
        cnd += " AND psc.item='" + data.item + "' ";
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND si.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (si.code LIKE '%" + data.val + "%' OR si.specification LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT psc.id,psc.item,psc.sub_item,si.code,si.specification FROM product_sub_codification psc INNER JOIN sub_item si ON psc.sub_item = si.id where 1"+cnd+" GROUP BY psc.sub_item ORDER BY psc.id DESC LIMIT "+data.start+","+data.tot;
    //console.log(sql);
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(psc.id) tot FROM  product_sub_codification psc INNER JOIN sub_item si ON psc.sub_item = si.id  where 1"+cnd;
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
  },
  reportallAdditionsDet: function(data, cb){
      if (typeof data.fyear != 'undefined' ) {
        var cnd = '', _this = this ,item = [];
        var sql = "SELECT ai.id,ai.fyear,ai.date,DATE_FORMAT(ai.date,'%d, %b %Y') aidate,ait.quantity,ait.rate,ait.shift,a.asset_name,att.useful_life,ar.wdv,ar.slm,ait.sale,sai.rate as samount,DATE_FORMAT(sa.date,'%d, %b %Y') sadate FROM asset_info ai INNER JOIN asset_item ait ON ai.id = ait.asset_info INNER JOIN asset a ON ait.asset = a.id INNER JOIN assettype att ON a.asset_type=att.id INNER JOIN assetrate ar ON att.useful_life = ar.useful_life LEFT JOIN sale_asset_item sai ON sai.id = ait.sale_asset_item LEFT JOIN sale_asset sa ON sa.id = sai.sale_asset WHERE ai.fyear='"+data.fyear+"'";
        this.selectCustomDb(sql, function (row) {
          return cb(row);   
        });
    } else {
        return cb([]);
    }
  },
  reportallOpeningsDet: function(data, cb){
       if (typeof data.fyear != 'undefined' ) {
        var cnd = '', _this = this ,item = [];
        var sql = "SELECT ai.id,ai.fyear,ai.date,DATE_FORMAT(ai.date,'%d, %b %Y') aidate,ait.quantity,ait.rate,ait.shift,a.asset_name,att.useful_life,ar.wdv,ar.slm,ait.sale,sai.rate as samount,DATE_FORMAT(sa.date,'%d, %b %Y') sadate,att.companyact FROM asset_info ai INNER JOIN asset_item ait ON ai.id = ait.asset_info INNER JOIN asset a ON ait.asset = a.id INNER JOIN assettype att ON a.asset_type=att.id INNER JOIN assetrate ar ON att.useful_life = ar.useful_life LEFT JOIN sale_asset_item sai ON sai.id = ait.sale_asset_item LEFT JOIN sale_asset sa ON sa.id = sai.sale_asset WHERE ai.fyear<>'"+data.fyear+"'";
        this.selectCustomDb(sql, function (row) {
          return cb(row);   
        });
    } else {
        return cb([]);
    }
  },
getAssetSaleVen: function (data, cb) {
    var cnd = "",_this=this;
    if (typeof data.company != 'undefined') {
        cnd += " AND sa.company=" + data.company;
    }
    if (typeof data.status != 'undefined') {
        cnd += " AND sa.status='" + data.status + "' ";
    }
    if (typeof data.val != 'undefined') {
        cnd += " AND (c.name LIKE '%" + data.val + "%' OR c.company_name LIKE '%" + data.val + "%' OR a.asset_name LIKE '%" + data.val + "%' OR sai.rate LIKE '%" + data.val + "%') ";
    }
    var sql = "SELECT sa.id,sai.id as saiid,DATE_FORMAT(sa.date,'%d, %b %Y') asset_date,c.name,c.company_name,a.asset_name,sai.rate FROM sale_asset sa INNER JOIN customer c ON c.id=sa.customer INNER JOIN sale_asset_item sai ON sai.sale_asset = sa.id INNER JOIN asset a ON sai.asset = a.id LEFT JOIN assettype att ON a.asset_type = att.id  where 1"+cnd+" ORDER BY sa.id DESC LIMIT "+data.start+","+data.tot;
    this.selectCustomDb(sql, function (row) {
        sql = "SELECT count(sai.id) tot FROM sale_asset sa INNER JOIN customer c ON c.id=sa.customer INNER JOIN sale_asset_item sai ON sai.sale_asset = sa.id INNER JOIN asset a ON sai.asset = a.id LEFT JOIN assettype att ON a.asset_type = att.id  where 1"+cnd;
    
    _this.selectCustomDb(sql, function (tot) {
        return cb([row,tot]);
    });
    });
},
getSaleAssetEdit:function(data,cb){
    var arr={},_this=this;
    var sql = "SELECT id,DATE_FORMAT(date,'%m/%d/%Y') date,date as pdate,creation_date,location,note,customer,asset_doc FROM `sale_asset` WHERE id='" + data.id + "' ";
    this.selectCustomDb(sql, function (row) {
        row.forEach(async function (sa) {
            arr.sa=sa;
            arr.cus=await _this.asyncselectCustomDb("SELECT * FROM `customer`  WHERE id='" + sa.customer + "' ");
            arr.item=await _this.asyncselectCustomDb("SELECT a.id,sa.id as said,sa.asset_item,sa.quantity,sa.rate,sa.final_amount,a.asset_name,a.asset_no FROM sale_asset_item sa INNER JOIN asset a ON a.id=sa.asset WHERE sa.sale_asset='" + data.id + "'");
            arr.loc=await _this.asyncselectCustomDb("SELECT * FROM `asset_location`  WHERE id='" + sa.location + "' ");
            return cb(arr);
        });
    });
},




};
dp.connectDB();

