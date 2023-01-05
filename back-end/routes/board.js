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
      if(req.user) {
      let sql ='select * from lists where isShown=1 order by insert_date desc;'
      maria.query(sql, function(err, rows, fields) {
        if(!err) {
          res.json(rows)
        }else {
          res.status(400).json({msg: "FAIL"})
        }
      })
      }else {
        res.send({
          code:00,
          msg:'null token'
        })
      }
      
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
      if(req.user) {
        console.log(req.user)
        let sql = 'select * from lists where category=? and isShown=1 order by insert_date desc;';
        let params = req.params.category;
        maria.query(sql, params, function(err,rows,fields) {
          if(!err){
              res.send(rows)
          }else {
            res.send({
              code: 400,
              msg:'FAIL'
            })
          }
        })
      }else {
        res.send({
          code:400,
          msg:'null token'
        })
      }
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })

  router.patch('/hits/:num', function(req,res,next) {
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
      if(req.user) {
        try{
          let post_num = new Date();
          post_num = JSON.stringify(req.body.num) + JSON.stringify(post_num.getFullYear()) + JSON.stringify(post_num.getMonth()+1) + JSON.stringify(post_num.getDate()) + JSON.stringify(post_num.getTime());
          let sql = 'insert into lists (num,user_num,writer,title,contents,category) values (?,?,?,?,?,?)';
          let params = [post_num,req.body.num,req.body.writer, req.body.title, req.body.contents, req.body.category]
          maria.query(sql, params, function(err,results,fields) {
            if(!err){
              res.send({
                code: 200,
                msg: 'SUCCESS',
                resdata: res.body
              })
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
      }else {
        res.send({
          code: 400,
          msg: 'null token'
        })
      }
   
  })

  router.get('/write/:num',passport.authenticate('jwt', {session:false}) ,
  async(req,res,next)=> {
      try{
        if(req.user) {
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
        }else {
          res.send({
            code: 00,
            msg:'null token'
          })
        }
      }
      catch {
        res.send({
          code: 400,
          msg:'FAIL'
        })
      }
  })

 
  router.patch('/write/:num',passport.authenticate('jwt', {session:false}), 
  async (req,res,next) => {
    try{
      if(req.user) {
        
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
      }else {
        res.send({
          code:400,
          msg:'null token'
        })
      }
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })
  router.patch('/delete/:num', passport.authenticate('jwt', {session:false}),
  async (req,res,next) => {
    try{
      if(req.user) {
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
      }else {
        res.send({
          code:400,
          msg:'null token'
        })
      }
    }
    catch {
      res.send({
        code: 400,
        msg:'FAIL'
      })
    }
  })


  module.exports = router;