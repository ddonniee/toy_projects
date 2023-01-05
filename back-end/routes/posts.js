var express = require('express');
var router = express.Router();
const maria = require('../database/connect/maria')

router.get('/comment/:bid', 
    async (req,res,next) => {
        try{
            let sql = 'select comments.replier, comments.content, comments.cgroup, comments.cdepth, comments.date from comments inner join lists on comments.bid = lists.num where comments.bid = ? order by cgroup desc, cdepth;'
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

router.post('/comment/add',
    async (req,res,next) => {
        try{
            console.log('try',req.body.bid)
            let sql = 'insert into comments (bid,cgroup,cref,corder,cdepth,replier,content) values (?,?,?,?,?,?,?)';
            let params = [req.body.bid,req.body.cgroup, req.body.ref,req.body.order, req.body.cdepth, req.body.cwriter, req.body.ccontent]
            maria.query(sql,params,function(err,rows,fields) {
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
            console.log('catch')
            res.send({
                code:400,
                msg:'FAIL'
            })
        }
    }
)

module.exports = router;