var express = require('express');
var router = express.Router();
var loginService = require('../../services/login/loginService')

/* login */
router.get('/', function(req, res, next) {
  var user = loginService.login('wpw','aaa',req.session)
  if(user){
    res.send(user);
  }else{
    res.send('fail');
  }
});

module.exports = router;
