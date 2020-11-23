var express = require('express')
        , router = express.Router()
        , db = require('../../models/db/base');

/*sales additional fields functions start here*/
router.get('/', function (req, res) {
    db.query.selectDb('account', " company=" + req.session.user.cur_company, function (acc) {
        db.query.selectDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (row) {
            db.query.selectDb('offer_term_conditions_fields', " company=" + req.session.user.cur_company, function (termrow) {
    db.query.selectDb('settings', " company=" + req.session.user.cur_company, function (settings) {
                res.render('tmpl/setting/customer_code.html', {settings: settings[0], acc: acc, row: row,termrow:termrow});
            });
        });
       });
    });
});
router.post('/generalsave', function (req, res) {
    var rb = req.body;
    db.query.updateDbCustom('settings', {offer_custom_note: rb.offerNote, sales_offer_pre: rb.offerprefix, sales_offer_cen: rb.offercenter, sales_offer_su: rb.offersufix, sales_offer_div: rb.offerdivider,enquiry_pre:rb.enquiryprefix,enquiry_cen:rb.enquirycenter,enquiry_su:rb.enquirysufix,enquiry_div:rb.enquirydivider,wo_pre:rb.wo_prefix,wo_cen:rb.wo_center,wo_su:rb.wo_sufix,wo_div:rb.wo_divider,plan_pre:rb.plan_prefix,plan_cen:rb.plan_center,plan_su:rb.plan_sufix,plan_div:rb.plan_divider,amendment_pre: rb.amenmentprefix, amendment_cen: rb.amenmentcenter, amendment_su: rb.amenmentsufix, amendment_div: rb.amenmentdivider,asset_pre: rb.asset_prefix, asset_cen: rb.asset_center, asset_su: rb.asset_sufix, asset_div: rb.asset_divider,porder_pre: rb.po_prefix, porder_cen: rb.po_center,porder_su: rb.po_sufix, porder_div: rb.po_divider,penquiry_pre: rb.pe_prefix, penquiry_cen: rb.pe_center,penquiry_su: rb.pe_sufix, penquiry_div: rb.pe_divider, modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, " company=" + req.session.user.cur_company, function (uid) {});
    db.query.deleteDb('sales_additional_fields', " company=" + req.session.user.cur_company, function (uid) {});
    for (var k in rb.addfield) {
        db.query.insertDb('sales_additional_fields', {name: rb.addfield[k].name, amount: rb.addfield[k].amount, code: rb.addfield[k].code, account: rb.addfield[k].account, company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {});
    }
    db.query.deleteDb('offer_term_conditions', " company=" + req.session.user.cur_company, function (uid) {});
    for (var k in rb.addTerm) {
        db.query.insertDb('offer_term_conditions', {name: rb.addTerm[k].name, company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {});
    }
    generateLogFile({user: req.session.user.id, type: 'general settings updated', time: new Date(), refer_id: req.session.user.cur_company});
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});
router.get('/componentcategory', function (req, res) {
    db.query.selectDb('component_category', " company=" + req.session.user.cur_company, function (row) {
                res.render('tmpl/setting/componentcategory.html', {row:row});
            });
});
router.post('/componentcategorysave', function (req, res) {
    var rb = req.body;
    db.query.deleteDb('component_category', " company=" + req.session.user.cur_company, function (uid) {});
    for (var k in rb.addfield) {
        db.query.insertDb('component_category', {component_name: rb.addfield[k].name, company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (cid) {});
    }
    generateLogFile({user: req.session.user.id, type: 'component category settings updated', time: new Date(), refer_id: req.session.user.cur_company});
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

module.exports = router;