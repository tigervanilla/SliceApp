var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var MongoClient=require('mongodb').MongoClient
var dbConfig=require('./config/dbConfig')
var myMongoClient=null

MongoClient.connect(dbConfig.url,{useNewUrlParser:true},(err,dbClient)=>{
  if(err) throw err
  myMongoClient=dbClient
})


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var apiRouter=require('./routes/apiRoutes')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  req.db=myMongoClient.db(dbConfig.dbName)
  next()
})

app.use('/', apiRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('exit',(code)=>{
  myMongoClient.close()
  console.log(`About to exit with code ${code}`)
})

module.exports = app;
