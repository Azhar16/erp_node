var express = require('express')
        , router = express.Router()
        , config = require('config')
        , jsonfile = require('jsonfile')
        , db = require('../../../models/db/base');

router.get('/', function (req, res) {
    //db.query.selectDb('customer', " company=" + req.session.user.cur_company + "  AND status='active' AND tag='vendor' ", function (row) {
        res.render('tmpl/vendor/list.html');
    //});
});

router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var sql = "SELECT * FROM `customer` WHERE company=" + req.session.user.cur_company + " AND status='active' AND tag='vendor' AND (name like '%" + rb.search.value + "%' OR code LIKE '%" + rb.search.value + "%' OR company_name LIKE '%" + rb.search.value + "%' OR email LIKE '%" + rb.search.value + "%' OR ph LIKE '%" + rb.search.value + "%' OR address LIKE '%" + rb.search.value + "%' OR city LIKE '%" + rb.search.value + "%') LIMIT " + rb.start + "," + rb.length;
    db.query.selectCustomDb(sql, function (row) {
        if (row.length > 0) {
            sql = "SELECT count(id) tot FROM `customer` WHERE company=" + req.session.user.cur_company + " AND status='active' AND tag='vendor' AND (name like '%" + rb.search.value + "%' OR code LIKE '%" + rb.search.value + "%' OR company_name LIKE '%" + rb.search.value + "%' OR email LIKE '%" + rb.search.value + "%' OR ph LIKE '%" + rb.search.value + "%' OR address LIKE '%" + rb.search.value + "%' OR city LIKE '%" + rb.search.value + "%') ";
            db.query.selectCustomDb(sql, function (tot) {
                var arrObj = {
                    "draw": rb.draw++,
                    "recordsTotal": tot[0].tot,
                    "recordsFiltered": tot[0].tot,
                    "data": []
                };
                for (var i = 0; i < row.length; i++) {

                    var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + row[i].id + '" data-permission = "" class="dropdown-item c-l-e " title="Edit"> Edit </a>'
                       action += '<a data-id="' + row[i].id + '" data-permission = "" class="dropdown-item c-l-d " title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'

                    arrObj.data.push([row[i].name, row[i].company_name, row[i].ph, row[i].email, row[i].address + ' ' + row[i].city,action]);
                }
                res.end(JSON.stringify(arrObj));
            });
        }
    });
});

router.get('/new', function (req, res) {
    jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
            db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {
                res.render('tmpl/vendor/new.html', {state: state, payment_terms: config.get('payment_terms'),currency: config.get('currency'), su: su, country: country});
            });
        });
    });
});

router.post('/save', function (req, res) {
    var rb = req.body;
	db.query.ckDuplicateCustomerCompany({company:rb.company_name,id:rb.cid},function(stat){
		if(stat==true){
    if (typeof rb.cid !== 'undefined') {
        db.query.updateDb('customer', {code: rb.code, name: rb.name,currency:rb.currency, country: rb.country, gst_applicable: rb.gst_applicable, company_name: rb.company_name, ph: rb.ph, web: rb.web, email: rb.email, gst: rb.gst, pan: rb.pan, address: rb.address, city: rb.city, state: rb.state, zip: rb.zip, payment_terms: rb.payment_terms, credit_limit: rb.credit_limit, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.cid, function (cid) {
          db.query.updateDb('customer_shipping', {label: rb.name, country: rb.country, address: rb.address, city: rb.city, state: rb.state, zip: rb.zip, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.sid, function (sid) {});
            db.query.deleteDb('opening_balance', " account=" + rb.cid + " AND account_from='customer'", function (sid) {});
            var d = 0, c = 0;
            if (parseFloat(rb.opening_balance) > 0) {
                if (rb.opening_balance_type == 'Payable')
                    d = parseFloat(rb.opening_balance);
                else
                    c = parseFloat(rb.opening_balance);
            }
            db.query.insertDb('opening_balance', {account: rb.cid, account_from: 'customer', debit: d, credit: c, year: getFYear(new Date())}, function (oid) {});
            generateLogFile({user: req.session.user.id, type: 'customer modification', time: new Date(), refer_id: rb.cid});
        });
    } else {
        db.query.insertDb('customer', {code: rb.code, company: req.session.user.cur_company,currency:rb.currency, country: rb.country, tag: 'vendor', gst_applicable: rb.gst_applicable, web: rb.web, name: rb.name, company_name: rb.company_name, ph: rb.ph, email: rb.email, gst: rb.gst, pan: rb.pan, address: rb.address, city: rb.city, state: rb.state, zip: rb.zip, payment_terms: rb.payment_terms, credit_limit: rb.credit_limit, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {
         db.query.insertDb('customer_shipping', {customer: cid, label: rb.name, address: rb.address, country: rb.country, city: rb.city, state: rb.state, zip: rb.zip, created_by: req.session.user.id, modify_by: req.session.user.id}, function (sid) {
                        db.query.updateDb('customer', {default_shipping: sid}, cid, function (sid) {});
                    });
            var d = 0, c = 0;
            if (parseFloat(rb.opening_balance) > 0) {
                if (rb.opening_balance_type == 'Payable')
                    d = parseFloat(rb.opening_balance);
                else
                    c = parseFloat(rb.opening_balance);
            }
            db.query.insertDb('opening_balance', {account: cid, account_from: 'customer', debit: d, credit: c, year: getFYear(new Date())}, function (oid) {});
            generateLogFile({user: req.session.user.id, type: 'customer creation', time: new Date(), refer_id: cid});
        });
    }
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
	}
		else{
			res.end(JSON.stringify({'code': '2', 'msg': 'Duplicate company name!!!'}));
		}
	});
});

router.get('/edit/:id', function (req, res) {
    jsonfile.readFile('config/state.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
            db.query.selectDb('customer', " id=" + req.params.id, function (row) {
                db.query.selectDb('opening_balance', " account=" + row[0].id + " AND account_from='customer'", function (ob) {
                    db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {
                        res.render('tmpl/vendor/edit.html', {row: row[0], country: country,  state: state,currency: config.get('currency'), payment_terms: config.get('payment_terms'), su: su, ob: ob[0]});
                    });
                });
            });
        });
    });
});

router.get('/delete/:id', function (req, res) {
    db.query.updateDb('customer', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'cusromer delete', time: new Date(), refer_id: req.params.id});
        res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
    });
});

module.exports = router;