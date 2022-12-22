var express = require('express');
var router = express.Router();
const maria = require('../database/connect/maria')

router.get('/', function(req,res,next) {
  console.log('전체보기')
  try {
    let sql ='select * from lists where isShown=1;'
    maria.query(sql, function(err, rows, fields) {
      console.log('mariadb 접속')
      if(!err) {
        res.send(rows)
      }else {
        res.send({
          code: 400,
          msg: 'FAIL'
        })
      }
    })
  }
  catch{
    res.send({
      code:400,
      msg:'FAIL',
    })
  }
  })
  /**
   * 카테고리별 극 목록보기
   */
  router.get('/sort/:category', function(req,res,next) {

    console.log(req.params.category,'항목별보기')
    try{
      let sql = 'select * from lists where category=? and isShown=1';
      let params = req.params.category;
      
      console.log(params,'boardrouter')
      maria.query(sql, req.params.category, function(err,rows,fields) {
        if(!err){
          res.send(rows)
        }else {
          res.send({
            code: 400,
            msg:err
          })
        }
      })
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })
  router.patch('/hits/:num', function(req,res,next) {
    console.log('hits',req.body.hits)
    let sql = 'update lists SET hits=? where num=?';
    let params = [req.body.hits,req.params.num]
    maria.query(sql,params, function(err,rows,fields) {
      if(!err){
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: res.body
        })
      }else {
        res.send({
          code: 400,
          msg:err
        })
      }
    })
  })

  router.post('/write', function(req,res,next) {
    try{
      let sql = 'insert into lists (writer,title,contents,category) values (?,?,?,?)';
      let params = [req.body.writer, req.body.title, req.body.contents, req.body.category]
      maria.query(sql, params, function(err,rows,fields) {
        if(!err){
          res.send({
            code: 200,
            msg: 'SUCCESS',
            resdata: res.body
          })
        }else {
          res.send({
            code: 400,
            msg:err
          })
        }
      })
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })

  router.get('/write/:num', function(req,res,next) {
    try{
      let sql = 'select * from lists where num=?';
      let params = req.params.num
      maria.query(sql, params, function(err,rows,fields) {
        if(!err){
          res.send({
            code: 200,
            msg: 'SUCCESS',
            resdata: rows
          })
        }else {
          res.send({
            code: 400,
            msg:err
          })
        }
      })
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })
  router.patch('/write/:num', function(req,res,next) {
    try{
      let sql = 'update lists SET title=?, contents=?, category=? where num=? ';
      let params = [req.body.title,req.body.contents, req.body.category,req.params.num]
      maria.query(sql, params, function(err,rows,fields) {
        if(!err){
          res.send({
            code: 200,
            msg: 'SUCCESS',
            resdata: rows
          })
        }else {
          res.send({
            code: 400,
            msg:err
          })
        }
      })
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })
  router.patch('/delete/:num', function(req,res,next) {
    try{
      let sql = 'update lists SET isShown=0 where num=? ';
      let params = [req.params.num]
      maria.query(sql, params, function(err,rows,fields) {
        if(!err){
          res.send({
            code: 200,
            msg: 'SUCCESS',
            resdata: rows
          })
        }else {
          res.send({
            code: 400,
            msg:err
          })
        }
      })
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })


  module.exports = router;