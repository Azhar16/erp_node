var express = require('express')
        , config = require('config')
        , router = express.Router()
        , db = require('../../models/db/base')
        , moment = require('moment')
        , jsonfile = require('jsonfile')
        , formidable = require('formidable')
        , fs = require('fs')
        , path = require('path')
        , updateJsonFile = require('update-json-file')
        , options = { defaultValue: () => ({}) };


router.get('/', function (req, res) {
    db.query.selectDb('user', " status<>'delete' ", function (row) {
        res.render('tmpl/user/list.html', {row: row, logo_path: config.get('user_logo_path'), url: config.get('base_url')});
    });
});

router.get('/new', function (req, res) {
    res.render('tmpl/user/new.html');
});

router.get('/edit/:id', function (req, res) {
    db.query.selectDb('user', " id=" + req.params.id, function (row) {
        res.render('tmpl/user/edit.html', {row: row[0]});
    });
});
router.get('/delete/:id', function (req, res) {
    db.query.updateDb('user', {status: 'delete', modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'user delete', time: new Date(), refer_id: req.params.id});
        db.query.selectDb('user', " status<>'delete' ", function (row) {
            res.render('tmpl/user/list.html', {row: row, logo_path: config.get('user_logo_path'), url: config.get('base_url')});
        });
    });
});
router.get('/block/:id/:stat', function (req, res) {
    db.query.updateDb('user', {status: req.params.stat, modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()}, req.params.id, function (cid) {
        generateLogFile({user: req.session.user.id, type: 'user status ' + req.params.stat, time: new Date(), refer_id: req.params.id});
        db.query.selectDb('user', " status<>'delete' ", function (row) {
            res.render('tmpl/user/list.html', {row: row, logo_path: config.get('user_logo_path'), url: config.get('base_url')});
        });
    });
});

router.get('/role/:id', function (req, res) {
    var id = req.params.id;
    jsonfile.readFile('config/userrole.json', function (err, userrole) {
        jsonfile.readFile('settings/'+id+'.json', function (err, usavedrole) {
          if(typeof usavedrole =='undefined' ){
            generateUserType({userid:id,obj:userrole});
            usavedrole=userrole;
          }
    res.render('tmpl/user/role.html',{userrole:userrole,userid:req.params.id,usavedrole:usavedrole});
  });
    });
});
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(config.get('base_url'));
        if (err)
            throw err;
    });
});
router.get('/switchcompany', function (req, res) {
    db.query.selectDb('company', " status<>'delete' ", function (row) {
        res.render('tmpl/user/switchcompany.html', {row: row, curcom: req.session.user.cur_company});
    });
});
router.post('/logincheck', function (req, res) {
    //console.log(req.body);
    db.query.selectDb('user', 'uid="' + req.body.uid + '" AND pwd="' + req.body.pwd + '" AND status="active"', function (row) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200, {'Content-Type': 'application/json'});
        if (row && row.length > 0) {
            db.query.selectDb('company', ' id=' + row[0].cur_company, function (com) {
                req.session.user = row[0];
                req.session.company = com[0];
                req.session.save();
                db.query.updateDb('user', {login_date: new Date().getTime()}, row[0].id, function (row) {});
                generateLogFile({user: row[0].id, type: 'system login', time: new Date()});
                res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
            });
        } else {
            res.end(JSON.stringify({'code': '0', 'msg': 'Invalid user name id or password!!'}));
        }
    });
});

router.post('/newsave', function (req, res) {
    var form = new formidable.IncomingForm();
    var ctime = new Date().getTime();
    form.uploadDir = config.get('user_logo_path');
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
            var pvar = {name: fields.name, uid: fields.uid, email: fields.email, address: fields.address, ph: fields.ph, img: lname, modify_by: req.session.user.id, modification_date: new Date().toMysqlFormat()};
            if (fields.password !== '******')
                pvar.pwd = fields.password;
            db.query.updateDb('user', pvar, fields.id, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'user modification', time: new Date(), refer_id: fields.id});
            });
        } else {
            db.query.insertDb('user', {name: fields.name, uid: fields.uid, email: fields.email, address: fields.address, pwd: fields.password, ph: fields.ph, img: lname, cur_company: req.session.user.cur_company, created_by: req.session.user.id, modify_by: req.session.user.id}, function (uid) {
                generateLogFile({user: req.session.user.id, type: 'urer creation', time: new Date(), refer_id: uid});
            });
        }
    });
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});
router.post('/switchsave', function (req, res) {
    db.query.updateDb('user', {cur_company:req.body.company}, req.session.user.id, function (uid) {
        generateLogFile({user: req.session.user.id, type: 'company switch', time: new Date(), refer_id: req.body.company});
        req.session.user.cur_company = req.body.company;
        req.session.save();
    });
    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});
router.post('/userrolesave', function (req, res) {
    var rb = req.body;
       
          fs.writeFile('settings/'+rb.userid+'.json', JSON.stringify(rb.usrnewroll), function (err) {});

          res.end(JSON.stringify({'code': '1', 'msg': 'success'}));


});

module.exports = router;