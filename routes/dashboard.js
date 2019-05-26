const Cryptr = require('cryptr');
var express = require('express');
var router = express.Router();

/* GET home page. */

// TITLE DO SITE

// Variaveis Globais
const title = "Get Set Pet";
var data = [
  { id: 1, name: "Administrador" },
  { id: 2, name: "Moderador" },
];
var status = [
  { id: 1, name: "Ativado" },
  { id: 2, name: "Desativado" },
];

// ROTA DE CONTROLE DE LOGIN - LOGOUT

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      // console.log(req.session.passport.user)
      return next()
    }
    // return next()
    res.redirect('/login?notLogged=true')
  }
}

// router.get('/chart', function(req, res, next) {
//   res.render('charts', { title: title , username: req.session.passport.user[0].NOME });
// });

router.get('/chart', function (req, res, next) {
  global.conn.request()
    .query(`
    select ID_LOJA as id, NM_LOJA as nome from LOJA`)
    .then((results) => {
      var resultadobd = results.recordset;

      console.log(Object.keys(resultadobd[0]))

      res.render('charts', { title: title, username: req.session.passport.user[0].NOME, localidade: resultadobd });
      // return res.json({message: "cadastro feito com sucesso"})

    })
    .catch((err) => {

      console.log(err)
      res.render('error');

    })

});

router.get('/loja/:localidade?', (req, res, next) => {
  global.conn.request()
    .query(`
    select ID_COMPUTADOR as id, HOSTNAME as nome from COMPUTADOR where FK_ID_LOJA = ${req.params.localidade}`)
    .then((results) => {
      var resultadobd = results.recordset;

      res.send(resultadobd);
      // return res.json({message: "cadastro feito com sucesso"})

    })
    .catch((err) => {

      console.log(err)
      res.render('error');

    })
})

router.get('/cpu/:idMaquina?', (req, res, next) => {
  var arrayCpu = [];
  var arrayData = [];
  global.conn.request()
    .query(`
    select TOP 100 CPU_PORCENT as cpu, DATA_HORA_DADO as data_hora from DADOS_COMPUTADOR`)
    .then((results) => {
      var dados = results.recordset;

      // CRIAÇÃO DOS ARRAYS COM AS INFORMAÇÕES RETORNADAS DO BANCO

      for (var i = 0; i < dados.length; i++) {

        arrayCpu[i] = dados[i].cpu;
        arrayData[i] = dados[i].data_hora;

      }
      // COLOCANDO OS INFORMAÇÕES TRATADAS DENTRO DO OBJ DADOS PARA FAZER O ENVIO

      dados = {
        cpu: arrayCpu.reverse(),
        date: arrayData.reverse(),
      };

      // ENVIO DAS INFORMAÇÕES COMO RESPOSTA

      res.send(dados);

      // LIMPA VARIAVEIS PARA PEGAR PROXIMA COLETA;

      dados = {}
      arrayCpu = [];
      arrayData = [];
      // })
      // res.send(resultadobd);
      // return res.json({message: "cadastro feito com sucesso"})

    })
    .catch((err) => {

      console.log(err)
      res.render('error');

    })
})

router.get('/hd/:idMaquina?', (req, res, next) => {
  dados = {}
  arrayLivre = [];
  arrayUtilizado = [];
  arrayData = [];
  arrayhora = [];
  global.conn.request()
    .query(`
    select TOP 1 HD_LIVRE, HD_UTILIZADA, DATA_HORA_DADO as data_hora from DADOS_COMPUTADOR ORDER BY ID_DADO DESC`)
    .then((results) => {
      var dados = results.recordset;

      // CRIAÇÃO DOS ARRAYS COM AS INFORMAÇÕES RETORNADAS DO BANCO

      for (var i = 0; i < dados.length; i++) {

        arrayLivre[i] = dados[i].HD_LIVRE;
        arrayUtilizado[i] = dados[i].HD_UTILIZADA;
        arrayData[i] = dados[i].data_hora;

      }
      // COLOCANDO OS INFORMAÇÕES TRATADAS DENTRO DO OBJ DADOS PARA FAZER O ENVIO

      dados = {
        livre: arrayLivre.reverse(),
        utilizado: arrayUtilizado.reverse(),
        date: arrayData.reverse(),
      };

      // ENVIO DAS INFORMAÇÕES COMO RESPOSTA

      res.send(dados);

      // LIMPA VARIAVEIS PARA PEGAR PROXIMA COLETA;

      dados = {}
      arrayLivre = [];
      arrayUtilizado = [];
      arrayData = [];
      // })
      // res.send(resultadobd);
      // return res.json({message: "cadastro feito com sucesso"})

    })
    .catch((err) => {

      console.log(err)
      res.render('error');

    })
})




module.exports = router;

