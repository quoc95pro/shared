var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var mongoose = require("mongoose");
var config = require("./config");
const SitemapGenerator = require('sitemap-generator');
var schedule = require('node-schedule');
const puppeteer = require('puppeteer');
var Cash = require('./models/cash');


async function getInfo123Link() {
const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
await page.goto('https://123link.co/auth/signin', { waitUntil: 'networkidle0' }); // wait until page load
await page.type('#username', 'quoc1995pro@gmail.com');
await page.type('#password', 'aassdd');

// click and wait for navigation
await Promise.all([
          page.click('.btn-flat'),
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);


const elements = await page.$$(".inner h3"); 
const views = await (await elements[0].getProperty('innerHTML')).jsonValue();
const earned = await (await elements[1].getProperty('innerHTML')).jsonValue();

const cash = new Cash({
  views: views,
  earned: Number.parseFloat(earned.substring(1)).toFixed(2),
  date: new Date()
});

await cash.save(cash, (err, c) => {
  if(err){
    console.log(err);
  }else{
    console.log('get info 123link ok');
  }
});

await browser.close();
}


var j = schedule.scheduleJob('36 22 * * *', function(){
  var generator = SitemapGenerator('https://taigamekhung.com', {
  maxDepth: 0,
  lastMod: true,
  changeFreq: 'daily',
  priorityMap: [
    1.0,
    0.9,
    0.8
  ],
  filepath: './public/sitemap.xml',
  maxEntriesPerFile: 50000,
  stripQuerystring: true
});
  // register event listeners
  generator.on('done', () => {
    console.log('done');
  });

  // start the crawler
  generator.start();
  getInfo123Link()
});

var app = express();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin/users');
var adminRouter = require('./routes/admin/admin');
var gamesRouter = require('./routes/admin/game');



//CORS...
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

mongoose.connect(config.getDBConnectionString(), {useCreateIndex: true, useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge:  7 * 60 * 60 * 1000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());


app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.cate = req.flash('cate');
  res.locals.messages = require('express-messages')(req, res);
  if(req.isAuthenticated()) {
  res.locals.user = req.user;
  } else {
  res.locals.user = null;
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/games', gamesRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });




//error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('public/error');
// });



module.exports = app;








