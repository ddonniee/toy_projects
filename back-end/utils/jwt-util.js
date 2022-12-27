const {promisfy} = require('util')
const jwt = require('jsonwebtoken')
const redisClient = require('./redis')
const secret = process.env.JWT_kEY;

module.exports = {
    sign:(user)=>{  // access token 발급
        const payload ={ // access token에 들어갈 payload
            id: userId,
            pw: userPw,
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: '1h',
        })
    },
    verify: (token) =>{ // access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
                pw: decoded.pw,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: ()=>{ // refresh token 발급
        return jwt.sign({}, secret, {
            algorithm: 'HS256',
            expiresIn: '14d'
        });
    },
    refreshVerify: async (token, userId) => { // refresh token 검증
        /**
         * redis module 은 기본적으로 promise를 반환하지 않으므로,
         * promisfy를 이용하여 promise를 반환하게 해준다
         */
        const getAsync = promisfy(redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(userId); // refresh token 가져오기
            if(token===date) {
                try{
                    jwt.verify(token, secret);
                    return true;
                }catch(err){
                    return false
                }
            }else {
                return false;
            }
        } catch(err) {
            return false;
        }
    }
}