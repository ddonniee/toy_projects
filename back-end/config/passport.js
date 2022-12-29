require('dotenv').config();

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { ExtractJwt, Strategy:JWTStrategy} = require('passport-jwt');
const maria = require('../database/connect/maria')


// passport.serializeUser(function(user, done) {
//     console.log("serializeUser ", user)
//     done(null, user.id);
//   });
  
// passport.deserializeUser(function(id, done) {
//     console.log("deserializeUser id ", id)
//     var userinfo;
//     var sql = 'SELECT * FROM users WHERE user_id=?';
//     maria.query(sql , [id], function (err, result) {
//     if(err) console.log('mysql 에러');     
//     console.log("deserializeUser mysql result : " , result);
//     var json = JSON.stringify(result[0]);
//     userinfo = JSON.parse(json);
//     done(err, user);
//     })    
// });

const JWTConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
}
const JWTVerify  = async (jwtPayload, done) =>{
    let sql ='select * from users where user_id=?';
    console.log('JWTVerify',jwtPayload)
    try{
        const user = await maria.query(sql,jwtPayload.id, function(err,results, fields){
            if(err) return next(err)
            else if(results[0] === undefined || results[0] !== '[]') {
                return jwtPayload
            }else {
                return results;
            }
        })
        if(user) {
            done(null, user);
            return;
        }
        done(null, false, { message:'inaccurate token'});
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}


passport.use('jwt',new JWTStrategy(JWTConfig, JWTVerify));

const passportConfig = {usernameField:'userId', paaswordField:'userPw'}

passport.use(
    'signup',
    new localStrategy(passportConfig, async(userId, userPw, done)=>{
        
        return done(null, userId)
        return done(null, false, {message:'User Creation Fail'});
    })
)
passport.use(
    'signin',
    new localStrategy(passportConfig, function(userId, userPw, done) {
        let sql = 'select select * from users where user_id = ? and user_pw = ?';
        maria.query(sql, [userId, userPw], function(err,result) {
            if(err) console.log('maria db error')
            console.log('db connected')
            let json = JSON.stringify(result[0])
            let userInfo = JSON.parse(json)
            return done(null, userInfo)
        })
    })
)
module.exports = {passport};
