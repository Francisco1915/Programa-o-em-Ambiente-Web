var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRouter = require('./routes/employee');
var bookRouter = require('./routes/book');
var emailRouter = require('./routes/email');
var orderRouter = require('./routes/order');
var bookApiRouter = require('./routes/bookApi');
var userApiRouter = require('./routes/usersApi');
var cartApiRouter = require('./routes/cartApi');
var cors = require("cors");


var app = express();

//Connect to mongodb
//Alterar URL de acesso á base de dados.
const dbURL = 'mongodb+srv://luis:luis@cluster0.0rbz9.mongodb.net/test'
mongoose.connect(dbURL)
  .then((result) => console.log('connect to db'))
  .catch((err => console.log(err)))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/email', emailRouter);
app.use('/api/v1/books', bookApiRouter);
app.use('/api/v1/users', userApiRouter);
app.use('/api/v1/carts', cartApiRouter);
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/employee', employeeRouter);
app.use('/books', bookRouter);
app.use('/orders', orderRouter);

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
