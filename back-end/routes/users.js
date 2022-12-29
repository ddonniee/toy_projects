require('dotenv').config();

var express = require('express');

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const auth = require('../config/authMiddleware')
var router = express.Router();
const maria = require('../database/connect/maria');
const passport = require('passport');
const { runInContext } = require('vm');

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * jwt 요청 API
 */
router.post('/', (req,res,next)=>{
  try{
    const key = process.env.JWT_kEY;
    const {userId, userPw} = req.body;
    const sql = 'select * from users where user_id = ? AND user_pw = ?';
    const sql2 = 'update users set refresh_token=? where user_id = ? AND user_pw=?;'
    const params = [userId, userPw]
    // 회원정보 일치하는 경우 results에 담김

    console.log(req.cookies,'==')
    maria.query(sql, params, function(err,results, fields){
      if(err) {
        console.log(err)
        return next(err)
      }else if(results[0] == '[]' ){
        return res.json({
          code: 400,
          message: 'not joined'
      })
      }else if(results[0] != undefined) {
        passport.authenticate('signin', {
          successRedirect: '/',
          failureRedirect:'/login',
          session:true,
          failureFlash:true,
        })
        let accessToken = jwt.sign({
          id: userId, pw:userPw
      }, key, {expiresIn: '7h'})
        let refreshToken = jwt.sign({
          id: userId, pw:userPw
        }, key, {expiresIn:'14d'})

      const params2 = [userId, userPw, refreshToken]
      maria.query(sql2, params2, function(err,results,fields) {
        if(err){
          console.log('refresh token err',err)
        }else {
          console.log('return refresh token',results)
          
        }
      })
      res.cookie('token',accessToken)
      res.send({accessToken})
      }
    })
  }catch(err){
    res.send({
      code: 400,
      msg: err
    })
  }
})
router.get('/', function(req,res) {
  console.log(req.cookies,'쿠키학인')
  try{
    const key = process.env.JWT_kEY;
    const {userId, userPw} = req.body;
    const sql = 'select * from users where user_id = ? AND user_pw = ?';
    const sql2 = 'update users set refresh_token=? where user_id = ? AND user_pw=?;'
    const params = [userId, userPw]
    // 회원정보 일치하는 경우 results에 담김

    console.log(req.user,'==')
    maria.query(sql, params, function(err,results, fields){
      if(err) {
        console.log(err)
        return next(err)
      }else if(results[0] == '[]' ){
        return res.json({
          code: 400,
          message: 'not joined'
      })
      }else if(results[0] != undefined) {
        passport.authenticate('signin', {
          successRedirect: '/',
          failureRedirect:'/login',
          session:true,
          failureFlash:true,
        })
        let accessToken = jwt.sign({
          id: userId, pw:userPw
      }, key, {expiresIn: '7h'})
        let refreshToken = jwt.sign({
          id: userId, pw:userPw
        }, key, {expiresIn:'14d'})

      const params2 = [userId, userPw, refreshToken]
      maria.query(sql2, params2, function(err,results,fields) {
        if(err){
          console.log('refresh token err',err)
        }else {
          console.log('return refresh token',results)
          
        }
      })
      res.cookie('refresh_token',refreshToken)
      res.send({accessToken})
      }
    })
  }catch(err){
    res.send({
      code: 400,
      msg: err
    })
  }
}) 

/**
 * 회원가입 요청 API
 */
router.post('/add', function(req,res,next) {

  if(req.body.id === '' || req.body.pw === '' || req.body.name === '') {
    return res.send({
      code: 400,
      msg: 'information required'
    })
  }
  try{
    let sql = 'insert into users (user_id, user_pw, user_name) values (?,?,?)';
    let params = [req.body.id, req.body.pw, req.body.name]

    maria.query(sql, params, function(err, rows, fields){
      if(!err) {
        res.send({
          code: 200,
          msg: 'SUCCESS',
          resdata: res.body
        })
      }else {
        res.send({
          code: 400,
          mag: err
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
module.exports = router;
