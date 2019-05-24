var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */

// TITLE DO SITE
// Variaveis Globais
const title = "Get Set Pet";
var data = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Moderador"},
];

// ROTA DE CONTROLE DE LOGIN - LOGOUT

function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      // console.log(req.session.passport.user[0].NOME)
      return next()
    }
    // return next()
    res.redirect('/login?notLogged=true')
  }
}

router.get('/login', function(req, res){
  if(req.isAuthenticated()){
    res.redirect('/index')
  }
  else if(req.query.fail){
    res.render('login',{ title: title + ' Login', message: 'Usuário e/ou senha incorretos!' });
  }
  else if(req.query.notLogged){
    res.render('login',{ title: title + ' Login', message: 'Por gentileza realize o login para acessar o sistema' });
  }
  else{
    res.render('login', { title: title + ' Login', message: "" });
  }
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
  console.log("teste")
  res.render('public', { title: 'ADMIN' });
});
router.get('/index', authenticationMiddleware(), function(req, res, next) {
  res.render('index', { title: title , username: req.session.passport.user[0].NOME});
});


router.get('/forgot', function(req, res, next) {
  res.render('forgot-password', { title: title });
});

router.get('/register', authenticationMiddleware(), function(req, res, next) {
  res.render('register', { data: data,  title: title , message: ""});
});
router.get('/tables', authenticationMiddleware(), function(req, res, next) {
  res.render('tables', { title: title , username: req.session.passport.user[0].NOME });
});
router.get('/cards', authenticationMiddleware(), function(req, res, next) {
  res.render('cards', { title: title , username: req.session.passport.user[0].NOME });
});
router.get('/utilities-color', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-color', { title: title , username: req.session.passport.user[0].NOME });
});
router.get('/utilities-animation', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-animation', { title: title , username: req.session.passport.user[0].NOME });
});
router.get('/utilities-other', authenticationMiddleware(), function(req, res, next) {
  res.render('utilities-other', { title: title , username: req.session.passport.user[0].NOME });
});

router.get('/registerlocal', authenticationMiddleware(), function(req,res,_next){
  res.render('local', {data: data, title: title, message: ""})
});




module.exports = router;
