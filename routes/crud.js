const Cryptr = require('cryptr');
var express = require('express');
var router = express.Router();

/* GET home page. */

// TITLE DO SITE

// Variaveis Globais
const title = "Get Set Pet";
var data = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Moderador"},
];

// ROTA DE CONTROLE DE LOGIN - LOGOUT

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.session.passport.user)
      return next()
    }
    // return next()
    res.redirect('/login?notLogged=true')
  }
}

<<<<<<< HEAD
router.post('/teste', function (req, res) {
  var nome = req.body.FirstName;
  console.log(nome);

  res.redirect('/register?susess=true');
})
=======
router.post('/validar', function(req, res){
  res.redirect('/register?susess=true');
});
>>>>>>> ed7bda82559af5c7ce4d022808ae10ba59cb2530

router.post('/cadusuario', (req, res) => {
  const cryptr = new Cryptr('myTotalySecretKey');
  const nome = req.body.FirstName + " " + req.body.LastName;
  const email = req.body.InputEmail;
  const username = req.body.FirstName + "_" + req.body.LastName;
  const senha = cryptr.encrypt(req.body.InputPassword);
  const nvAcesso = parseInt(req.body.NivelAcesso);

  const decryptedString = cryptr.decrypt(senha);

  console.log(decryptedString); // bacon

  global.conn.request()
    .query(`insert into USUARIO (NOME, EMAIL, USERNAME, SENHA, FK_NV_ACESSO) values ('${nome}','${email}','${username}','${senha}','${nvAcesso}');`)
    .then((results) => {
      var linhasafetadas = results.rowsAffected;
      console.log("Rota de cadastro usuario ativada, Linhas Afetadas no banco: " + linhasafetadas);
      if (linhasafetadas.length != 0) {
        res.render('register', { data: data,  title: title  , message: "cadastro feito com sucesso"});
        // return res.json({message: "cadastro feito com sucesso"})
      }
    }) // Caso der erro na procura de usuário
    .catch((err) => {
      var erro = "" + err;
      var dpusuario = erro.indexOf(username);
      var dpemail = erro.indexOf(email);
      
      
        console.log(err)
        res.redirect('/register?susess=false');
      
    })
  
})


module.exports = router;

