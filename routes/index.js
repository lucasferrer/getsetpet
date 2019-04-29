var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */

// TITLE DO SITE

const title = "Get Set Pet";


// ROTA DE CONTROLE DE LOGIN - LOGOUT

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.session.passport.user)
      return next()
    }
    // return next()
    res.redirect('/login?notLogged=true')
  }
}

router.get('/login', function(req, res){
  if(req.query.fail)
    res.render('login',{ title: title + ' Login', message: 'Usuário e/ou senha incorretos!' });
  if(req.query.notLogged)
    res.render('login',{ title: title + ' Login', message: 'Por gentileza realize o login para acessar o sistema!' });
  else
    res.render('login', { title: title + ' Login', message: "" });
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
  res.render('public', { title: title });
});
router.get('/index', authenticationMiddleware(), function(req, res, next) {
  res.render('index', { title: title , username: req.session.passport.user});
});
router.get('/chart', authenticationMiddleware(), function(req, res, next) {
  res.render('charts', { title: title , username: req.session.passport.user });
});

router.get('/forgot', function(req, res, next) {
  res.render('forgot-password', { title: title });
});
router.get('/register', authenticationMiddleware(), function(req, res, next) {
  var data = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Moderador"},
];
  res.render('register', { data: data,  title: title , username: req.session.passport.user });
});
router.get('/tables', authenticationMiddleware(), function(req, res, next) {
  res.render('tables', { title: title , username: req.session.passport.user });
});
router.get('/cards', authenticationMiddleware(), function(req, res, next) {
  res.render('cards', { title: title , username: req.session.passport.user });
});
router.get('/utilities-color', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-color', { title: title , username: req.session.passport.user });
});
router.get('/utilities-animation', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-animation', { title: title , username: req.session.passport.user });
});
router.get('/utilities-other', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-other', { title: title , username: req.session.passport.user });
});

module.exports = router;
