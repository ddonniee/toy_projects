var express = require('express');

const jwt = require('jsonwebtoken')
const auth = require('../config/authMiddleware')

const jmt = require('../utils/jwt-util')
const redis = require('../utils/redis')

var router = express.Router();

const maria = require('../database/connect/maria');
const redisClient = require('../utils/redis');

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * jwt token 요청 API
 */
router.post('/', async(req,res)=>{

  console.log('jwt jmt,',req.body)
  try{
    // const key = process.env.JWT_kEY;
    const {userId, userPw} = req.body;
    const sql = 'select * from users where user_id = ? AND user_pw = ?';
    const params = [userId, userPw]
    maria.query(sql, params, function(err,results, fields){
      if(err) {
        console.log(err)
      }else if(results.length !== 0){

        // const accessToken = jmt.sign(params)
        // const refreshToken = jmt.refresh();
        
        // redisClient.set(userId, refreshToken);

        // res.status(200).send({
        //   ok: true,
        //   data: {
        //     accessToken,
        //     refreshToken
        //   }
        // })
        const token = jwt.sign({
          userId,
          userPw,
        }, process.env.JWT_KEY, {
          expiresIn: '1d',
          issuer:'b_admin'
        });
        // const refreshToken = jmt.refresh(token)

        return res.json({
          code: 200,
          message: 'token issued',
          // data:{
          //   token,
          //   refreshToken
          // }
          token,
          // refreshToken
        })
      }else {
        return res.json({
          code: 400,
          message: 'not joined'
        })
      }
    })


    // maria.query(sql, params, (err,results,fields)=>{
    //   if(err){
    //     res.json({
    //       code: 400,
    //       msg: 'FAIL',
    //     })
    //   }else if(req.body.id==null){
    //     res.json({
    //       code: 400,
    //       msg: 'null id'
    //     })
    //   }else {
    //     const token = jwt.sign({
    //       userId,
    //       userPw,
    //     }, process.env.JWT_KEY, {
    //       expiresIn: '7d',
    //       issuer:'b_admin'
    //     });
    //     return res.json({
    //       code: 200,
    //       message: 'token issued',
    //       token
    //     })
    //   }
    // })
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
