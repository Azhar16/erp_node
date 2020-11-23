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
    res.render('tmpl/asset_partner/list.html');
  
});


router.post('/ajaxget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getAssetPartnerVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';

                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                     var img = '<img src="images/asset/'+data[0][i].img+'" class="company-logo-list" />'
                    arrObj.data.push([img,data[0][i].name,data[0][i].phno, data[0][i].email, action]);
            }
        }
        res.end(JSON.stringify(arrObj));
    });
});

router.get('/new', function (req, res) {
    res.render('tmpl/asset_partner/new.html');
});

router.get('/edit/:id', function (req, res) {
    db.query.selectDb('asset_partner', " id=" + req.params.id, function (row) {
        res.render('tmpl/asset_partner/edit.html', {row: row[0]});
    });
});
router.get('/delete/:id', function (req, res) {
    db.query.updateDb('asset_partner', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'asset Partner delete', time: new Date(), refer_id: req.params.id});
        db.query.selectDb('asset_partner', " status<>'delete' ", function (row) {
            res.render('tmpl/asset_partner/list.html', {row: row});
        });
    });
});

router.get('/alocation', function (req, res) {
    res.render('tmpl/asset_location/list.html');
  
});


router.post('/ajaxLocget', function (req, res) {
    var rb = req.body;
    var arrObj = {
                draw: rb.draw++,
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
            };
    db.query.getAssetlocationVen({company: req.session.user.cur_company, status: 'active', val: rb.search.value, start: rb.start, tot: rb.length}, function (data) {
        if (data[0].length > 0) {
            arrObj.recordsTotal=arrObj.recordsFiltered=data[1][0].tot;
            
            for (var i = 0; i < data[0].length; i++) {
                var pstatus = '<a class="btn btn-danger btn-trans waves-effect w-md waves-danger m-b-5">expired</a>';

                    pstatus = '<a class="btn btn-success btn-trans waves-effect w-md waves-success m-b-5">Accepted</a>';
                       var action = '<div class="btn-group">'
                       action +=  '<button type="button" class="btn btn-secondary dropdown-toggle waves-effect btn-primary" data-toggle="dropdown" aria-expanded="false"> Action <span class="caret"></span> </button>'
                       action += '<div class="dropdown-menu">'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-e" title="Edit"> Edit </a>'
                       action += '<a data-id="' + data[0][i].id + '"   class="dropdown-item s-l-d" title="Delete"> Delete </a>'
                       action += '</div>'
                       action += '</div>'
                    arrObj.data.push([data[0][i].label,data[0][i].city+'-'+data[0][i].zip+','+data[0][i].state+','+data[0][i].country, action]);
            }
           
            
        }
        res.end(JSON.stringify(arrObj));
    });
});

router.get('/locnew', function (req, res) {
    jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
    res.render('tmpl/asset_location/new.html',{country:country,state:state});
  });
 });
});

router.get('/locedit/:id', function (req, res) {
    jsonfile.readFile('config/country.json', function (err, country) {
        jsonfile.readFile('config/state.json', function (err, state) {
    db.query.selectDb('asset_location', " id=" + req.params.id, function (row) {
        res.render('tmpl/asset_location/edit.html', {row: row[0],country:country,state:state});
    });
});
    });
});
router.get('/locdelete/:id', function (req, res) {
    db.query.updateDb('asset_location', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'asset location delete', time: new Date(), refer_id: req.params.id});
        db.query.selectDb('asset_location', " status<>'delete' ", function (row) {
            res.render('tmpl/asset_location/list.html', {row: row});
        });
    });
});



router.post('/save', function (req, res) {
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('asset_doc');
    form.on('file', function (field, file) {
        fs.renameSync(file.path, path.join(form.uploadDir, ctime + file.name));
    });
    form.parse(req, function (err, fields, files) {
        var lname = '';
        if (typeof (files.logo) !== 'undefined')
            lname = ctime + files.logo.name;
        if (fields.id !== 'undefined') {
            if (lname === '')
                lname = fields.ologo;
            var pvar = {name: fields.name, email: fields.email, address: fields.address, phno: fields.ph, img: lname, modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()};
            db.query.updateDb('asset_partner', pvar, fields.id, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'Asset partner modification', time: new Date(), refer_id: fields.id});
                res.end(JSON.stringify({'code': fields.id, 'msg': 'Success'}));
            });
        } else {
            db.query.insertDb('asset_partner', {name: fields.name, email: fields.email, address: fields.address, phno: fields.ph, img: lname, company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'Asset partner creation', time: new Date(), refer_id: uid});
                res.end(JSON.stringify({'code': uid, 'msg': 'Success'}));
            });
        }
    });
    
});
router.post('/locsave', function (req, res) {
    var rb = req.body;
 if (typeof rb.sid !== 'undefined') {
                db.query.updateDb('asset_location', {label: rb.label, address: rb.address, country: rb.country, city: rb.city, state: rb.state, zip: rb.zip, modification_date: new Date().toMysqlFormat(), modify_by: req.session.user.id}, rb.sid, function (eid) {
                    generateLogFile({user: req.session.user.id, type: 'asset location modification', time: new Date(), refer_id: rb.planid});
                    res.end(JSON.stringify({'code': rb.sid, 'msg': 'Success'}));
                });
            }

else{
    db.query.insertDb('asset_location', {company:req.session.user.cur_company ,label: rb.label, country: rb.country, address: rb.address, city: rb.city, state: rb.state, zip: rb.zip, created_by: req.session.user.id, modify_by: req.session.user.id}, function (pid) {
       generateLogFile({user: req.session.user.id, type: 'asset location creation', time: new Date(), refer_id: pid});
         res.end(JSON.stringify({'code': pid, 'msg': 'Success'}));

});
 }
  });


module.exports = router;