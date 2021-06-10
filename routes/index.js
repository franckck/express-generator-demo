var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('req.user', req.user);
  res.render('index', { title: 'Express' });
});

router.get('/ab?cd', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
