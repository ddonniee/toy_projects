"use strict";

require('dotenv').config();

var express = require('express');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var auth = require('../config/authMiddleware');

var jwtUtil = require('../utils/jwt-util');

var redis = require('../utils/redis');

var router = express.Router();

var maria = require('../database/connect/maria');

var redisClient = require('../utils/redis');

var passport = require('passport');
/* GET users listing. */


router.get('/', auth, function (req, res, next) {
  res.send('respond with a resource');
});
/**
 * jwt token 요청 API
 */
// router.post('/', async(req,res)=>{

router.post('/', function (req, res, next) {
  console.log('jwt jmt,', req.body);

  try {
    var key = process.env.JWT_kEY;
    var _req$body = req.body,
        userId = _req$body.userId,
        userPw = _req$body.userPw;
    var sql = 'select * from users where user_id = ? AND user_pw = ?';
    var params = [userId, userPw];
    maria.query(sql, params, function (err, results, fields) {
      if (err) {
        console.log(err);
      } else if (results.length !== 0) {
        console.log(results[0]);
        passport.authenticate('signin', {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        });
        var token = jwt.sign({
          id: userId,
          pw: userPw
        }, 'jwt-secert-key');
        res.send({
          token: token
        }); //     passport.authenticate('signin', (err, user, info)=>{
        //       if(!user) {
        //         return res.status(400).json({message:results})
        //       }
        //       const token = jwt.sign(
        //         { 
        //           usernameField:userId,
        //           paaswordField:userPw 
        //         },
        //         process.env.JWT_KEY
        //       );
        //       res.json({token});
        //     })(req,res,next)
        // let info = {type: false, message: ''};
        // crypto.createHash('sha512').update(userPw).digest('base64');
        // let hex_password = crypto.createHash('sha512').update(userPw).digest('hex');
        // const accessToken = jwt.sign({
        //   userId,
        //   userPw,
        // }, process.env.JWT_KEY, {
        //   expiresIn: '1d',
        //   issuer:'b_admin'
        // });
        // const refreshToken = jwtUtil.refresh()
        // redisClient.set(userId,refreshToken)
        // info.message = 'success';
        // res.setHeader('Content-Type','application/json; charset=utf-8');
        // res.setHeader('Authorization', 'Bearer ' + accessToken);
        // res.setHeader('Refresh', 'Bearer ' + refreshToken);
        // return res.json({
        //   code: 200,
        //   message: 'token issued',
        //   token:{
        //     accessToken,
        //     refreshToken
        //   }
        // })
      } else {
        return res.json({
          code: 400,
          message: 'not joined'
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