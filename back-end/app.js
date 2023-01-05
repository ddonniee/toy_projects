var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./config/passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var postsRouter = require('./routes/posts');

var app = express();
const session = require('express-session');
/**
 * mariaDB connect
 */
const maria = require('./database/connect/maria');
maria.connect();

var safeSiteList = ['http://192.168.0.77:8081','http://localhost:8081','http://192.168.0.77:3001']

app.use(cors({
  origin: function(origin, callback) {
      var isSafeSiteListed = safeSiteList.indexOf(origin) !== -1;
      callback(null, isSafeSiteListed);
  },
  credentials: true,
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*'
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({ // 옵션은 반드시 넣어줘야 한다.
    resave: false, // 매번 세션 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.JWT_KEY, // cookie 암호화 키. dotenv 라이브러리로 감춤
    cookie: {
      httpOnly: true, // javascript로 cookie에 접근하지 못하게 하는 옵션
      secure: false, // https 프로토콜만 허락하는 지 여부
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session()); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
app.use('/posts', postsRouter);

app.get('/board', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Origin", "*");
})


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
