const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req,res,next) => {
    const accsessToken = req.header('Authorization');

    if(accsessToken == null || accsessToken == undefined) {
        res.status(401).json({
            success: false,
            errorMessage: 'Authrization fail (null token)'
        });
    }else {
        try{
            const token = accsessToken.split('')[1];
            const tokenInfo = await new Promise ((resolve, reject)=>{
                jwt.verify(token, process.env.JWT_KEY,
                    (err,decoded)=>{
                        if(err) {
                            reject(err);;
                        }else {
                            resolve(decoded);
                        }
                    });
            });
            req.tokenInfo = tokenInfo;
            next();
        }catch (err){
            res.status(401).json({
                success:false,
                errorMessage: result.message
            })
        }
    }
}
module.exports = authMiddleware;
