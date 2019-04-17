var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Projeto PI2' });
});
router.get('/charts', function(req, res, next) {
  res.render('charts', { title: 'Charts PI2' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login PI2' });
});
router.get('/forgot', function(req, res, next) {
  res.render('forgot-password', { title: 'Esqueceu a senha PI2' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registrar PI2' });
});
router.get('/tables', function(req, res, next) {
  res.render('tables', { title: 'Tabelas PI2' });
});
router.get('/cards', function(req, res, next) {
  res.render('cards', { title: 'Cards PI2' });
});
router.get('/utilities-color', function(req, res, next) {
  res.render('utilities-color', { title: 'Utilities PI2' });
});
router.get('/utilities-animation', function(req, res, next) {
  res.render('utilities-animation', { title: 'Utilities PI2' });
});
router.get('/utilities-other', function(req, res, next) {
  res.render('utilities-other', { title: 'Utilities PI2' });
});

module.exports = router;
