var express = require('express');
var router = express.Router();
const maria = require('../database/connect/maria')

router.get('/comment/:bid', 
    async (req,res,next) => {
        console.log(req.params.bid,'[[[[[[[[[[[[[[[[[')
        try{
            let sql = 'select comments.replier, comments.content, comments.cgroup, comments.depth, comments.date from comments inner join lists on comments.bid = lists.num where comments.bid = ? order by cgroup desc, depth;'
            let params = req.params.bid;
            maria.query(sql,params, function(err,rows,fields) {
                if(err) {
                    console.log(err)
                    return false
                }else {
                    res.send(rows)
                }
            })
        }catch{
            res.send({
                code:400,
                msg:'FAIL'
            })
        }
})

router.post('comment/:bid',
    async (req,res,next) => {
        try{
            let sql = 'insert into comments (bid, cgroup, cdepth, cwriter, ccontent) value(?,?,?,?,?);'
            let param = req.body;
            maria.query(sql,param,function(err,rows,fields) {
                if(err) {
                    return false
                }else {
                    res.send({
                        code:200,
                        msg:'SUCCESS'
                    })
                }
            })
        }catch{
            res.send({
                code:400,
                msg:'FAIL'
            })
        }
    }
)

module.exports = router;