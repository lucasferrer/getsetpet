var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

// router.post('/login',
//   passport.authenticate('local', { successRedirect: '/index',
//                                    failureRedirect: res.render('login', { title: 'Login PI2' }),
//                                    failureFlash: true })
// );