var express = require('express')
        , router = express.Router()
        , config = require('config')
        , formidable = require('formidable')
        , fs = require('fs')
        , jsonfile = require('jsonfile')
        , path = require('path')
        , nodemailer = require('nodemailer')
        , db = require('../models/db/base')
        , moment = require('moment')


router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect(config.get('base_url'));
        if (err)
            throw err;
    });
});

router.post('/sendMessage', function (req, res) {
   let transporter = nodemailer.createTransport({
    service: 'gmail',
      auth: {
        user: "azhar.sibyl@gmail.com",
        pass: "azhar16@sibyl"
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from:"Payroll" + "azhar.sibyl@gmail.com", // sender address
      to: req.body.to, // list of receivers
      subject: "Change your password", // Subject line
      text: "Change your password by given link bellow ", // plain text body
      //html: '<p><b></b> req.body.message</p>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.send({success:'Email sent succesfully'});
  });


    res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
});

router.post('/logincheck', function (req, res) {

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

router.post('/ajax_login_check', function (req, res) {
    db.query.selectDb('user', 'uid="' + req.body.uid + '" AND pwd="' + req.body.pwd + '" AND status="active"', function (row) {
       if (row && row.length > 0) {
       res.end(JSON.stringify({'code': '1', 'msg': 'Success'}));
     }
     else{
         res.end(JSON.stringify({'code': '0', 'msg': 'Error'}));
     }
    });
});



module.exports = router;