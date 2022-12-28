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
  try {
    var sql = 'select * from lists where isShown=1 order by num desc;';
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
 * 카테고리별 극 목록보기
 */

router.get('/sort/:category', function (req, res, next) {
  try {
    var sql = 'select * from lists where category=? and isShown=1 order by num desc;';
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
}); // router.post('/write',auth, function(req,res,next) {
//   try{
//     let post_num = new Date().getTime();
//     post_num = JSON.stringify(req.body.num) + JSON.stringify(post_num) ;
//     let sql = 'insert into lists (num,user_num,writer,title,contents,category) values (?,?,?,?,?,?)';
//     let params = [post_num,req.body.num,req.body.writer, req.body.title, req.body.contents, req.body.category]
//     maria.query(sql, params, function(err,rows,fields) {
//       if(!err){
//         res.send({
//           code: 200,
//           msg: 'SUCCESS',
//           resdata: res.body
//         })
//       }else {
//         res.send({
//           code: 400,
//           msg:err
//         })
//       }
//     })
//   }
//   catch {
//     res.send({
//       code: 400,
//       msg:'FAIL'
//     })
//   }
// })

router.post('/write', function (req, res, next) {
  try {
    var post_num = new Date();
    console.log(post_num, 'post_num');
    post_num = JSON.stringify(req.body.num) + JSON.stringify(post_num.getFullYear()) + JSON.stringify(post_num.getMonth() + 1) + JSON.stringify(post_num.getDate()) + JSON.stringify(post_num.getTime());
    var sql = 'insert into lists (num,user_num,writer,title,contents,category) values (?,?,?,?,?,?)';
    var params = [post_num, req.body.num, req.body.writer, req.body.title, req.body.contents, req.body.category];
    maria.query(sql, params, function (err, results, fields) {
      if (!err) {
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: res.body
        });
      } else {
        res.send({
          code: 400,
          msg: 'FAIL'
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
  } catch (_unused3) {
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
  } catch (_unused4) {
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
  } catch (_unused5) {
    res.send({
      code: 400,
      msg: 'FAIL'
    });
  }
});
module.exports = router;