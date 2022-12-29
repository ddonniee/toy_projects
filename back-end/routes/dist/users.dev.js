"use strict";

require('dotenv').config();

var express = require('express');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var auth = require('../config/authMiddleware');

var router = express.Router();

var maria = require('../database/connect/maria');

var passport = require('passport');

var _require = require('vm'),
    runInContext = _require.runInContext;
/* GET users listing. */


router.get('/', auth, function (req, res, next) {
  res.send('respond with a resource');
});
/**
 * jwt 요청 API
 */

router.post('/', function (req, res, next) {
  try {
    var key = process.env.JWT_kEY;
    var _req$body = req.body,
        userId = _req$body.userId,
        userPw = _req$body.userPw;
    var sql = 'select * from users where user_id = ? AND user_pw = ?';
    var sql2 = 'update users set refresh_token=? where user_id = ? AND user_pw=?;';
    var params = [userId, userPw]; // 회원정보 일치하는 경우 results에 담김

    console.log(req.cookies, '==');
    maria.query(sql, params, function (err, results, fields) {
      if (err) {
        console.log(err);
        return next(err);
      } else if (results[0] == '[]') {
        return res.json({
          code: 400,
          message: 'not joined'
        });
      } else if (results[0] != undefined) {
        passport.authenticate('signin', {
          successRedirect: '/',
          failureRedirect: '/login',
          session: true,
          failureFlash: true
        });
        var accessToken = jwt.sign({
          id: userId,
          pw: userPw
        }, key, {
          expiresIn: '7h'
        });
        var refreshToken = jwt.sign({
          id: userId,
          pw: userPw
        }, key, {
          expiresIn: '14d'
        });
        var params2 = [userId, userPw, refreshToken];
        maria.query(sql2, params2, function (err, results, fields) {
          if (err) {
            console.log('refresh token err', err);
          } else {
            console.log('return refresh token', results);
          }
        });
        res.cookie('token', accessToken);
        res.send({
          accessToken: accessToken
        });
      }
    });
  } catch (err) {
    res.send({
      code: 400,
      msg: err
    });
  }
});
router.get('/', function (req, res) {
  console.log(req.cookies, '쿠키학인');

  try {
    var key = process.env.JWT_kEY;
    var _req$body2 = req.body,
        userId = _req$body2.userId,
        userPw = _req$body2.userPw;
    var sql = 'select * from users where user_id = ? AND user_pw = ?';
    var sql2 = 'update users set refresh_token=? where user_id = ? AND user_pw=?;';
    var params = [userId, userPw]; // 회원정보 일치하는 경우 results에 담김

    console.log(req.user, '==');
    maria.query(sql, params, function (err, results, fields) {
      if (err) {
        console.log(err);
        return next(err);
      } else if (results[0] == '[]') {
        return res.json({
          code: 400,
          message: 'not joined'
        });
      } else if (results[0] != undefined) {
        passport.authenticate('signin', {
          successRedirect: '/',
          failureRedirect: '/login',
          session: true,
          failureFlash: true
        });
        var accessToken = jwt.sign({
          id: userId,
          pw: userPw
        }, key, {
          expiresIn: '7h'
        });
        var refreshToken = jwt.sign({
          id: userId,
          pw: userPw
        }, key, {
          expiresIn: '14d'
        });
        var params2 = [userId, userPw, refreshToken];
        maria.query(sql2, params2, function (err, results, fields) {
          if (err) {
            console.log('refresh token err', err);
          } else {
            console.log('return refresh token', results);
          }
        });
        res.cookie('refresh_token', refreshToken);
        res.send({
          accessToken: accessToken
        });
      }
    });
  } catch (err) {
    res.send({
      code: 400,
      msg: err
    });
  }
});
/**
 * 회원가입 요청 API
 */

router.post('/add', function (req, res, next) {
  if (req.body.id === '' || req.body.pw === '' || req.body.name === '') {
    return res.send({
      code: 400,
      msg: 'information required'
    });
  }

  try {
    var sql = 'insert into users (user_id, user_pw, user_name) values (?,?,?)';
    var params = [req.body.id, req.body.pw, req.body.name];
    maria.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: res.body
        });
      } else {
        res.send({
          code: 400,
          mag: err
        });
      }
    });
  } catch (err) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
module.exports = router;