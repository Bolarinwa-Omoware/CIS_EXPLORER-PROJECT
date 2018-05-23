var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var favoriteRouter = require('./routes/favoriteRouter');

var geoFeatureRouter = require('./routes/geoFeatureRouter');

var propertyVatRouter = require('./routes/propertyVatRouter');
var ogr2ogr = require('ogr2ogr');


const allFileUploadRouter = require('./routes/allFileUploadRouter');
const mongodbOperationRouter = require('./routes/mongodbOperationRouter');
const feturesUploadRouter = require('./routes/featuresUpload');



const uploadRouter = require('./routes/uploadRouter');



const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// const Dishes = require('../../CIS-EXPLORER-CLIENT/src/');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

//Get the default connection
var db = mongoose.connection;

// ogr2ogr('./public/awoya.zip').exec(function(er, data) {
//     if (er) console.error(er);
//     data.name = 'map content'
//     console.log(JSON.stringify(data, null, ' '));

// });

// for (let i = 1; i <= 3; i++) {
//     setTimeout(function() {
//         console.log(i + " second(s) elapsed");
//     }, i * 1000);
// }

// function getData(options) {
//     return new Promise(function(resolve, reject) { //create a new promise
//         $.get("example.php", options, function(response) {
//             resolve(JSON.parse(response)); //in case everything goes as planned
//         }, function() {
//             reject(new Error("AJAX request failed!")); //in case something goes wrong
//         });
//     });
// }


connect.then(() => {
    console.log("<<<<< Connected to MongoDb Server >>>>>>");

}, (err) => {
    console.log(err);

});

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../../CIS-EXPLORER-CLIENT/dist/CIS-EXPLORER-CLIENT')));
app.use('/', express.static(path.join(__dirname, '../../CIS-EXPLORER-CLIENT/dist/CIS-EXPLORER-CLIENT')));


app.use(passport.initialize());


app.use('/api', indexRouter);
app.use('/users', usersRouter);



app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/geofeatures', geoFeatureRouter);
app.use('/property', propertyVatRouter);
app.use('/upload', allFileUploadRouter);
app.use('/mongodbUpload', mongodbOperationRouter);



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

module.exports = app;