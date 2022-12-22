var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('ues')
  res.render('index', { title: 'whyrano' });
});

module.exports = router;
