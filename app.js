var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('express-session')
  ,config = require('config')
  , port = config.get('port'),
          fs = require('fs');
const cron = require("node-cron");

app.set('views', __dirname + '/views/'+config.get('default_theam'));
//app.set('views', __dirname + '/views/'+config.get('dark_theam'));
app.set('models', __dirname + '/models');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(session({
    secret: "mysqc",
    name: "mycookie",
    resave: true,
    proxy: true,
    saveUninitialized: true,
    duration: 9999999,
    activeDuration: 9999999,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    cookie: { 
        secure: false,
        maxAge: 99999999
    }
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views/'+config.get('default_theam')));
//app.use(express.static(__dirname + '/views/'+config.get('dark_theam')));
app.use(express.static(__dirname + '/models'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('./controllers'));
//app.use(require('./controllers/report'));
app.use(express.static(require('path').join(__dirname, 'public')));
app.use(function (req, res, next) {
  if (! ('JSONResponce' in res) ) {
    return next();
  }

  res.setHeader('Cache-Control', 'no-cache');
  res.json(res.JSONResponce);
});

cron.schedule("* * * * *", function() {
  let cl = require('./models/jobs/updateDepreciationValue');
   // cl.updateDepreciationValue();
});

process.on('uncaughtException', function (err) {
    fs.appendFile('log/error.log', (new Date).toUTCString() + ' uncaughtException:'+ err.message+`\n`, function (err) {});
    fs.appendFile('log/error.log', err.stack+`\n`, function (err) {});
});

app.listen(port, function() {
  console.log('Listening on port ' + port)
});
