"use strict";

require('dotenv').config();

var passport = require('passport');

var localStrategy = require('passport-local').Strategy;

var _require = require('passport-jwt'),
    ExtractJwt = _require.ExtractJwt,
    JWTStrategy = _require.Strategy;

var maria = require('../database/connect/maria');

passport.serializeUser(function (user, done) {
  console.log("serializeUser ", user);
  done(null, user.ID);
});
passport.deserializeUser(function (id, done) {
  console.log("deserializeUser id ", id);
  var userinfo;
  var sql = 'SELECT * FROM users WHERE user_id=?';
  mysql.query(sql, [id], function (err, result) {
    if (err) console.log('mysql 에러');
    console.log("deserializeUser mysql result : ", result);
    var json = JSON.stringify(result[0]);
    userinfo = JSON.parse(json);
    done(null, userinfo);
  });
});
var JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY
};

var JWTVerify = function JWTVerify(jwtPayload, done) {
  return regeneratorRuntime.async(function JWTVerify$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!user) {
            _context.next = 4;
            break;
          }

          done(null, 'user');
          return _context.abrupt("return");

        case 4:
          done(null, false, {
            message: 'inaccurate token'
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          done(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
var passportConfig = {
  usernameField: 'userId',
  paaswordField: 'userPw'
};
passport.use('signup', new localStrategy(passportConfig, function _callee(userId, userPw, done) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", done(null, userId));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}));
passport.use('signin', new localStrategy(passportConfig, function (userId, userPw, done) {
  var sql = 'select select * from users where user_id = ? and user_pw = ?';
  maria.query(sql, [userId, userPw], function (err, result) {
    if (err) console.log('maria db error');
    console.log('db connected');
    var json = JSON.stringify(result[0]);
    var userInfo = JSON.parse(json);
    return done(null, userInfo);
  });
}));
module.exports = {
  passport: passport
};