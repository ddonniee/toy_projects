require('dotenv').config();

var express = require('express');

const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const auth = require('../config/authMiddleware')

const jwtUtil = require('../utils/jwt-util')
const redis = require('../utils/redis')

var router = express.Router();

const maria = require('../database/connect/maria');
const redisClient = require('../utils/redis');
const passport = require('passport');


/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * jwt token 요청 API
 */
// router.post('/', async(req,res)=>{
router.post('/', (req,res,next)=>{
  try{
    const key = process.env.JWT_kEY;
    const {userId, userPw} = req.body;
    const sql = 'select * from users where user_id = ? AND user_pw = ?';
    const params = [userId, userPw]
    maria.query(sql, params, function(err,results, fields){
      if(err) {
        console.log(err)
      }else if(results.length !== 0){
        console.log(results[0])
        passport.authenticate('signin', {
          successRedirect: '/',
          failureRedirect:'/login',
          failureFlash:true
        })
        let token = jwt.sign({
          id: userId, pw:userPw
      }, 'jwt-secert-key')
      res.send({token})
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
      }else {
        return res.json({
          code: 400,
          message: 'not joined'
        })
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
