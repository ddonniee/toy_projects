var express = require('express');
var router = express.Router();
// const auth = require('../config/authMiddleware')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const maria = require('../database/connect/maria');
const passport = require('passport');

router.get('/',passport.authenticate('jwt', {session:false}), 
  async (req,res,next)=>{
    try {
      let sql ='select * from lists where isShown=1 order by num desc;'
      maria.query(sql, function(err, rows, fields) {
        console.log('mariadb 접속')
        if(!err) {
          // 인증되지 않은 경우 req.user의 값은 false,
          if(req.user) {
            try {
              res.json(rows)
            }
            catch {
              res.json({result : false})
            }
          }else {
            console.log('------------------')
          }
        }else {
          res.status(400).json({msg: fields})
        }
      })
    }
    catch{
      res.send({
        code:400,
        msg:'FAIL',
      })
    }
  });

  /**
   * 카테고리별 극 목록보기
   */
   router.get('/sort/:category', passport.authenticate('jwt', {session:false}), 
   async(req,res,next) => {
    try{
      let sql = 'select * from lists where category=? and isShown=1 order by num desc;';
      let params = req.params.category;
      maria.query(sql, params, function(err,rows,fields) {
        console.log(params)
        if(!err){
          try {
            res.send(rows)
          }catch(err) {
            res.send({result:false})
          }
          
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
  //   router.get('/sort/:category', function(req,res,next) {
  //   try{
  //     let sql = 'select * from lists where category=? and isShown=1 order by num desc;';
  //     let params = req.params.category;
      
  //     // if(req.isAuthenticated()){
  //     //   return res.redirect('/login')
  //     // }
  //     // passport
  //     maria.query(sql, req.params.category, function(err,rows,fields) {
  //       if(!err){
  //         res.send(rows)
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

  router.post('/write',passport.authenticate('jwt', {session:false}), 
    async (req,res,next) => {
    try{
      let post_num = new Date();
      console.log(post_num,'post_num')
      post_num = JSON.stringify(req.body.num) + JSON.stringify(post_num.getFullYear()) + JSON.stringify(post_num.getMonth()+1) + JSON.stringify(post_num.getDate()) + JSON.stringify(post_num.getTime());
      let sql = 'insert into lists (num,user_num,writer,title,contents,category) values (?,?,?,?,?,?)';
      let params = [post_num,req.body.num,req.body.writer, req.body.title, req.body.contents, req.body.category]
      maria.query(sql, params, function(err,results,fields) {
        if(!err){
          try {
            res.send({
              code: 200,
              msg: 'SUCCESS',
              resdata: res.body
            })
          }catch (err) {
            res.send({
              code: 00,
              msg: 'null token'
            })
          }
        }
        else {
          res.send({
            code:400,
            msg:'FAIL'
          })
        }
      })
    }
    catch(err){
      res.send({
        code: 400,
        msg: 'FAIL'
      })
    }
  })
  // router.post('/write', function(req,res,next) {
  //   try{
  //     let post_num = new Date();
  //     console.log(post_num,'post_num')
  //     post_num = JSON.stringify(req.body.num) + JSON.stringify(post_num.getFullYear()) + JSON.stringify(post_num.getMonth()+1) + JSON.stringify(post_num.getDate()) + JSON.stringify(post_num.getTime());
  //     let sql = 'insert into lists (num,user_num,writer,title,contents,category) values (?,?,?,?,?,?)';
  //     let params = [post_num,req.body.num,req.body.writer, req.body.title, req.body.contents, req.body.category]
  //     maria.query(sql, params, function(err,results,fields) {
  //       if(!err){
  //         res.send({
  //           code: 200,
  //           msg: 'SUCCESS',
  //           resdata: res.body
  //         })
  //       }
  //       else {
  //         res.send({
  //           code:400,
  //           msg:'FAIL'
  //         })
  //       }
  //     })
  //   }
  //   catch(err){
  //     res.send({
  //       code: 400,
  //       msg: 'FAIL'
  //     })
  //   }
  // })
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
  router.patch('/delete/:num',function(req,res,next) {
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