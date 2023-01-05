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
router.get('/', function(req, res, next) {
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
    const params = [userId, userPw]
    // 회원정보 일치하는 경우 results에 담김

    maria.query(sql, params, function( err,results, fields){
      
      // 500 error
      if(err) {
        return next(err)
      }
      // user not found
      else if(results[0] == '[]' ){
        return res.json({
          code: 400,
          message: 'not joined'
      })
      }
      else if(results[0] != undefined) {
        passport.authenticate('login', {
          successRedirect: '/',
          failureRedirect:'/login',
          session:false,
          failureFlash:true,
        })
        let accessToken = jwt.sign({
          id: userId, pw:userPw
      }, key, {expiresIn: '1h'})

      res.cookie('token',accessToken, {maxAge: 60 * 60 * 3600}) // 토큰 시간 1시간으로 설정
      res.cookie('id', results[0].user_id)
      res.cookie('name',results[0].user_name)
      res.cookie('num',results[0].user_num)
      res.send({
        accessToken: accessToken,
        num:results[0].user_num,
        id: results[0].user_id,
        name: results[0].user_name,
      })
      console.log('22 request11',req.login)
      }
    })
  }catch(err){
    res.send({
      code: 400,
      msg: err
    })
  }
})

router.get('/logout', function (req,res,next) {
  req.logout(function(err) {
    if(err) {
      return next(err)
    }else {
      res.clearCookie('token');
      res.json({
        code:200,
        message:'SUCCESS'
      })
    }
    
  });
  
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
