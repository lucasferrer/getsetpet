var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */



// ROTA DE CONTROLE DE LOGIN - LOGOUT

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    // return next()
    res.redirect('/login?notLogged=true')
  }
}

router.get('/login', function(req, res){
  if(req.query.fail)
    res.render('login',{ title: 'Login', message: 'Usuário e/ou senha incorretos!' });
  if(req.query.notLogged)
    res.render('login',{ title: 'Login', message: 'Por gentileza realize o login para acessar o sistema!' });
  else
    res.render('login', { title: 'Login', message: "" });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/index', failureRedirect: '/login?fail=true' })
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
// ROTAS PAGINAS

router.get('/', function(req, res, next) {
  res.render('public', { title: 'Projeto PI2' });
});
router.get('/index', authenticationMiddleware(), function(req, res, next) {
  res.render('index', { title: 'Projeto PI2' });
});
router.get('/charts', authenticationMiddleware(), function(req, res, next) {
  res.render('charts', { title: 'Charts PI2' });
});

router.get('/forgot', function(req, res, next) {
  res.render('forgot-password', { title: 'Esqueceu a senha PI2' });
});
router.get('/register', authenticationMiddleware(), function(req, res, next) {
  res.render('register', { title: 'Registrar PI2' });
});
router.get('/tables', authenticationMiddleware(), function(req, res, next) {
  res.render('tables', { title: 'Tabelas PI2' });
});
router.get('/cards', authenticationMiddleware(), function(req, res, next) {
  res.render('cards', { title: 'Cards PI2' });
});
router.get('/utilities-color', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-color', { title: 'Utilities PI2' });
});
router.get('/utilities-animation', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-animation', { title: 'Utilities PI2' });
});
router.get('/utilities-other', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-other', { title: 'Utilities PI2' });
});

module.exports = router;
