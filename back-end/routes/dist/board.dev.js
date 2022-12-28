"use strict";

var express = require('express');

var router = express.Router();

var auth = require('../config/authMiddleware');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var jwtUtil = require('../utils/jwt-util');

var redis = require('../utils/redis');

var redisClient = require('../utils/redis');

var maria = require('../database/connect/maria');

var passport = require('../config/passport');

router.get('/', function (req, res, next) {
  console.log('전체보기');

  try {
    var sql = 'select * from lists where isShown=1;';
    maria.query(sql, function (err, rows, fields) {
      console.log('mariadb 접속');

      if (!err) {
        res.send(rows);
      } else {
        res.send({
          code: 400,
          msg: 'FAIL'
        });
      }
    });
  } catch (_unused) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
/**
 * 토큰발급
 */

router.post('/', function (req, res, next) {
  console.log('jwt jmt,', req.body);
  passport.authenticate('signin', {
    successRedirect: '/board',
    failureRedirect: '/login',
    failureFlash: true
  }); // try{
  //   const key = process.env.JWT_kEY;
  //   const {userId, userPw} = req.body;
  //   const sql = 'select * from users where user_id = ? AND user_pw = ?';
  //   const params = [userId, userPw]
  //   maria.query(sql, params, function(err,results, fields){
  //     if(err) {
  //       console.log(err)
  //     }else if(results.length !== 0){
  //     passport.authenticate('signin', (err, user, info)=>{
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
  //       let info = {type: false, message: ''};
  //       crypto.createHash('sha512').update(userPw).digest('base64');
  //       let hex_password = crypto.createHash('sha512').update(userPw).digest('hex');
  //       const accessToken = jwt.sign({
  //         userId,
  //         userPw,
  //       }, process.env.JWT_KEY, {
  //         expiresIn: '1d',
  //         issuer:'b_admin'
  //       });
  //       const refreshToken = jwtUtil.refresh()
  //       redisClient.set(userId,refreshToken)
  //       info.message = 'success';
  //       res.setHeader('Content-Type','application/json; charset=utf-8');
  //       res.setHeader('Authorization', 'Bearer ' + accessToken);
  //       res.setHeader('Refresh', 'Bearer ' + refreshToken);
  //       return res.json({
  //         code: 200,
  //         message: 'token issued',
  //         token:{
  //           accessToken,
  //           refreshToken
  //         }
  //       })
  //     }else {
  //       return res.json({
  //         code: 400,
  //         message: 'not joined'
  //       })
  //     }
  //   })
  // }catch(err){
  //   res.send({
  //     code: 400,
  //     msg: err
  //   })
  // }
});
/**
 * 카테고리별 극 목록보기
 */

router.get('/sort/:category', function (req, res, next) {
  try {
    var sql = 'select * from lists where category=? and isShown=1';
    var params = req.params.category;
    console.log(params, 'boardrouter');
    maria.query(sql, req.params.category, function (err, rows, fields) {
      if (!err) {
        res.send(rows);
      } else {
        res.send({
          code: 400,
          msg: err
        });
      }
    });
  } catch (_unused2) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
router.patch('/hits/:num', function (req, res, next) {
  console.log('hits', req.body.hits);
  var sql = 'update lists SET hits=? where num=?';
  var params = [req.body.hits, req.params.num];
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
        msg: err
      });
    }
  });
});
router.post('/write', auth, function (req, res, next) {
  try {
    var post_num = new Date().getTime();
    post_num = JSON.stringify(req.body.num) + JSON.stringify(post_num);
    var sql = 'insert into lists (num,user_num,writer,title,contents,category) values (?,?,?,?,?,?)';
    var params = [post_num, req.body.num, req.body.writer, req.body.title, req.body.contents, req.body.category];
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
          msg: err
        });
      }
    });
  } catch (_unused3) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
router.get('/write/:num', function (req, res, next) {
  try {
    var sql = 'select * from lists where num=?';
    var params = req.params.num;
    maria.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: rows
        });
      } else {
        res.send({
          code: 400,
          msg: err
        });
      }
    });
  } catch (_unused4) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
router.patch('/write/:num', auth, function (req, res, next) {
  try {
    var sql = 'update lists SET title=?, contents=?, category=? where num=? ';
    var params = [req.body.title, req.body.contents, req.body.category, req.params.num];
    maria.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: rows
        });
      } else {
        res.send({
          code: 400,
          msg: err
        });
      }
    });
  } catch (_unused5) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
router.patch('/delete/:num', auth, function (req, res, next) {
  try {
    var sql = 'update lists SET isShown=0 where num=? ';
    var params = [req.params.num];
    maria.query(sql, params, function (err, rows, fields) {
      if (!err) {
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: rows
        });
      } else {
        res.send({
          code: 400,
          msg: err
        });
      }
    });
  } catch (_unused6) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
module.exports = router;