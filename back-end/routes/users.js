var express = require('express');

const jwt = require('jsonwebtoken')
const auth = require('../config/authMiddleware')

var router = express.Router();

const maria = require('../database/connect/maria')

const Crypto = require('crypto-js');
const crypt = require('crypto');
/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * 암호화 키 생성
 */
function encrypt(data,key) {
  return Crypto.AES.encrypt(data,key).toString();
}
function javaDecrypt(data,key) {
  var decryptedData=Crypto.AES.decrypt(data,key, {
    mode: Crypto.mode.ECB,
    padding: Crypto.pd.Pkcs7
  });
  return decryptedData.toString(Crypto.enc.utf8)
}
function nodeDecrypt(data,key) {
  return Crypto.ES.decrypt(data, key).toString(Crypto.enc.utf8);
}
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
        const token = jwt.sign({
          userId,
          userPw,
        }, process.env.JWT_KEY, {
          expiresIn: '7d',
          issuer:'b_admin'
        });
        return res.json({
          code: 200,
          message: 'token issued',
          token
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
