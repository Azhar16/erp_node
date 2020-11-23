var express = require('express')
        , router = express.Router()
        ,cf = require('../../../models/corefunction')
        ,config = require('config');

router.use('/plan', require('./plan'));
router.use('/enquiry', require('./enquiryrpt'));
router.use('/offer', require('./offerrpt'));
router.use('/workorder', require('./workorderrpt'));
router.use('/asset', require('./asset'));
router.use('/purchase_order', require('./purchase_order'));



router.get('/', function (req, res) {
    //console.log(req.session.employee);
     if (typeof (req.session.user) !== 'undefined' && req.session.user.id > 0) {
        res.redirect(config.get('base_url')+"dashboard");
    } else {
        res.render('login.html');
    }
    
});

module.exports = router;