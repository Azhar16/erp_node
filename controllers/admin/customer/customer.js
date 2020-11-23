var express = require('express')
        , router = express.Router()
        , config = require('config')
        , jsonfile = require('jsonfile')
        , db = require('../../../models/db/base');

router.get('/', function (req, res) {
    res.render('tmpl/customer/list.html');
});

router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var sql = "SELECT * FROM `customer` WHERE company=" + req.session.user.cur_company + " AND status='active' AND tag='customer' AND (name like '%" + rb.search.value + "%' OR code LIKE '%" + rb.search.value + "%' OR company_name LIKE '%" + rb.search.value + "%' OR email LIKE '%" + rb.search.value + "%' OR ph LIKE '%" + rb.search.value + "%' OR address LIKE '%" + rb.search.value + "%' OR city LIKE '%" + rb.search.value + "%') LIMIT " + rb.start + "," + rb.length;
    db.query.selectCustomDb(sql, function (row) {
        if (row.length > 0) {
            sql = "SELECT count(id) tot FROM `customer` WHERE company=" + req.session.user.cur_company + " AND status='active' AND tag='customer' AND (name like '%" + rb.search.value + "%' OR code LIKE '%" + rb.search.value + "%' OR company_name LIKE '%" + rb.search.value + "%' OR email LIKE '%" + rb.search.value + "%' OR ph LIKE '%" + rb.search.value + "%' OR address LIKE '%" + rb.search.value + "%' OR city LIKE '%" + rb.search.value + "%') ";
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
                       action += '<a data-id="' + row[i].id + '" data-permission = "" class="dropdown-item c-l-s " title="shiping"> Shiping </a>'
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
                res.render('tmpl/customer/new.html', {state: state, payment_terms: config.get('payment_terms'), currency: config.get('currency'), su: su, country: country});
            });
        });
    });
});
router.get('/shippingnew/:cid', function (req, res) {
    jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
            res.render('tmpl/customer/shippingnew.html', {state: state, cid: req.params.cid, country: country});
        });
    });
});

router.post('/save', function (req, res) {
    var rb = req.body;
    db.query.ckDuplicateCustomerCompany({company: rb.company_name, id: rb.cid}, function (stat) {
        if (stat == true) {
            var fyear = getFYear(new Date());
            if (typeof rb.cid !== 'undefined') {
                db.query.updateDb('customer', {code: rb.code, country: rb.country, currency: rb.currency, name: rb.name, company_name: rb.company_name, gst_applicable: rb.gst_applicable, ph: rb.ph, email: rb.email, web: rb.web, gst: rb.gst, pan: rb.pan, address: rb.address, city: rb.city, state: rb.state, zip: rb.zip, payment_terms: rb.payment_terms, credit_limit: rb.credit_limit, salesunit: rb.salesunit, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.cid, function (cid) {
                    db.query.deleteDb('opening_balance', " account=" + rb.cid + " AND account_from='customer'", function (sid) {});
                    db.query.updateDb('customer_shipping', {label: rb.label, country: rb.scountry, address: rb.saddress, city: rb.scity, state: rb.sstate, zip: rb.szip, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.sid, function (sid) {});
                    var d = 0, c = 0;
                    if (parseFloat(rb.opening_balance) > 0) {
                        if (rb.opening_balance_type == 'Payable')
                            d = parseFloat(rb.opening_balance);
                        else
                            c = parseFloat(rb.opening_balance);
                    }
                    db.query.insertDb('opening_balance', {account: rb.cid, account_from: 'customer', debit: d, credit: c, year: fyear}, function (oid) {});
                    generateLogFile({user: req.session.user.id, type: 'customer modification', time: new Date(), refer_id: rb.cid});
                });
            } else {
                db.query.insertDb('customer', {code: rb.code, company: req.session.user.cur_company, currency: rb.currency, country: rb.country, gst_applicable: rb.gst_applicable, name: rb.name, company_name: rb.company_name, web: rb.web, ph: rb.ph, email: rb.email, gst: rb.gst, pan: rb.pan, address: rb.address, city: rb.city, state: rb.state, zip: rb.zip, payment_terms: rb.payment_terms, credit_limit: rb.credit_limit, salesunit: rb.salesunit, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {
                    db.query.insertDb('customer_shipping', {customer: cid, label: rb.label, address: rb.saddress, country: rb.scountry, city: rb.scity, state: rb.sstate, zip: rb.szip, created_by: req.session.user.id, modify_by: req.session.user.id}, function (sid) {
                        db.query.updateDb('customer', {default_shipping: sid}, cid, function (sid) {});
                    });
                    var d = 0, c = 0;
                    if (parseFloat(rb.opening_balance) > 0) {
                        if (rb.opening_balance_type == 'Payable')
                            d = parseFloat(rb.opening_balance);
                        else
                            c = parseFloat(rb.opening_balance);
                    }
                    db.query.insertDb('opening_balance', {account: cid, account_from: 'customer', debit: d, credit: c, year: fyear}, function (oid) {});
                    generateLogFile({user: req.session.user.id, type: 'customer creation', time: new Date(), refer_id: cid});
                });
            }
            res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
        } else {
            res.end(JSON.stringify({'code': '2', 'msg': 'Duplicate company name!!!'}));
        }
    });
});

router.post('/shippingsave', function (req, res) {
    var rb = req.body;
    if (typeof rb.sid !== 'undefined') {
        db.query.updateDb('customer_shipping', {label: rb.label, address: rb.saddress, country: rb.scountry, city: rb.scity, gst: rb.gst, state: rb.sstate, zip: rb.szip, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.sid, function (sid) {});
        generateLogFile({user: req.session.user.id, type: 'customer shipping modification', time: new Date(), refer_id: rb.sid});
    } else {
        db.query.insertDb('customer_shipping', {customer: rb.cid, label: rb.label, country: rb.scountry, address: rb.saddress, city: rb.scity, gst: rb.gst, state: rb.sstate, zip: rb.szip, created_by: req.session.user.id, modify_by: req.session.user.id}, function (sid) {
            db.query.updateDb('customer', {default_shipping: sid}, rb.cid, function (sid) {});
            generateLogFile({user: req.session.user.id, type: 'customer shipping creation', time: new Date(), refer_id: sid});
        });
    }
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.get('/edit/:id', function (req, res) {
    jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
            db.query.selectDb('customer', " id=" + req.params.id, function (row) {
                db.query.selectDb('customer_shipping', " customer=" + row[0].id, function (cs) {
                    db.query.selectDb('opening_balance', " account=" + row[0].id + " AND account_from='customer'", function (ob) {
                        db.query.selectDb('sales_unit', " company=" + req.session.user.cur_company + "  AND status='active' ", function (su) {
                            res.render('tmpl/customer/edit.html', {row: row[0], cs: cs[0], state: state, payment_terms: config.get('payment_terms'), currency: config.get('currency'), su: su, ob: ob[0], country: country});
                        });
                    });
                });
            });
        });
    });
});
router.get('/shippingedit/:id/:cid', function (req, res) {
    jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
            db.query.selectDb('customer_shipping', " id=" + req.params.id, function (cs) {
                res.render('tmpl/customer/shippingedit.html', {cs: cs[0], state: state, cid: req.params.cid, country: country});
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

router.get('/shippingdelete/:id/:cid', function (req, res) {
    db.query.updateDb('customer_shipping', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'cusromer shipping delete', time: new Date(), refer_id: req.params.id});
        db.query.selectDb('customer', " id=" + req.params.cid, function (row) {
            db.query.selectDb('customer_shipping', " status='active' AND customer=" + row[0].id, function (cs) {
                res.render('tmpl/customer/shipping.html', {row: row[0], cs: cs});
            });
        });
    });
});
router.get('/shippinglist/:id', function (req, res) {
    db.query.selectDb('customer', " id=" + req.params.id, function (row) {
        db.query.selectDb('customer_shipping', " status='active' AND customer=" + row[0].id, function (cs) {
            res.render('tmpl/customer/shipping.html', {row: row[0], cs: cs});
        });
    });
});
router.get('/autovendor/:v', function (req, res) {
    db.query.selectDb('customer', " company=" + req.session.user.cur_company + " AND tag='vendor'  AND status='active' AND name like '%" + req.params.v + "%'", function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/autocustomer/:v', function (req, res) {
    db.query.selectDb('customer', " company=" + req.session.user.cur_company + " AND tag='customer' AND status='active' AND name like '%" + req.params.v + "%'", function (row) {
        res.end(JSON.stringify(row));
    });
});
router.get('/vendorbyid/:id', function (req, res) {
    db.query.selectDb('customer', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row[0]));
    });
});
router.get('/shipping/:id', function (req, res) {
    console.log("ss "+req.params.id);
    db.query.selectDb('customer_shipping', " customer=" + req.params.id, function (row) {
        console.log(row);
        res.end(JSON.stringify(row));
    });
});
router.get('/shippingbyid/:id', function (req, res) {
    db.query.selectDb('customer_shipping', " id=" + req.params.id, function (row) {
        res.end(JSON.stringify(row));
    });
});
module.exports = router;