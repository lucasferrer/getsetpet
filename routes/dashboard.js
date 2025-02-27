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
    select TOP 100 CPU_PORCENT as cpu, convert(varchar(5),DATA_HORA_DADO, 114) as data_hora from DADOS_COMPUTADOR where ID_COMPUTADOR = ${req.params.idMaquina} order by data_hora desc`)
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
    select TOP 1 HD_LIVRE, HD_UTILIZADA, DATA_HORA_DADO as data_hora from DADOS_COMPUTADOR where ID_COMPUTADOR = ${req.params.idMaquina} ORDER BY ID_DADO DESC`)
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

router.get('/ram/:idMaquina?', (req, res, next) => {
  dados = {}
  arrayLivre = [];
  arrayUtilizado = [];
  arrayData = [];
  global.conn.request()
    .query(`
    select TOP 1 RAM_LIVRE, RAM_UTILIZADA, DATA_HORA_DADO as data_hora from DADOS_COMPUTADOR where ID_COMPUTADOR = ${req.params.idMaquina} ORDER BY ID_DADO DESC`)
    .then((results) => {
      var dados = results.recordset;

      // CRIAÇÃO DOS ARRAYS COM AS INFORMAÇÕES RETORNADAS DO BANCO

      for (var i = 0; i < dados.length; i++) {

        arrayLivre[i] = dados[i].RAM_LIVRE;
        arrayUtilizado[i] = dados[i].RAM_UTILIZADA;
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

router.get('/historicoStatus', (req, res, next) => {

  numeroOcorrenciasOk = [];
  numeroOcorrenciasAlerta = [];
  numeroOcorrenciasGrave = [];
  diaOcorrencia = [];

  for (let i = 1; i <= 7; i++) {
    let dados;

    global.conn.request()
      .query(`select sum(
    CASE status_ram
    WHEN 'Ok' THEN 1
    ELSE 0 END +
    CASE status_hd
    WHEN 'Ok' THEN 1
    ELSE 0 END +
    CASE status_cpu
    WHEN 'Ok' THEN 1
    ELSE 0 END) as qtd_ok,
    sum(
    CASE status_ram
    WHEN 'Alerta' THEN 1
    ELSE 0 END +
    CASE status_hd
    WHEN 'Alerta' THEN 1
    ELSE 0 END +
    CASE status_cpu
    WHEN 'Alerta' THEN 1
    ELSE 0 END) as qtd_alerta,
    sum(
    CASE status_ram
    WHEN 'Grave' THEN 1
    ELSE 0 END +
    CASE status_hd
    WHEN 'Grave' THEN 1
    ELSE 0 END +
    CASE status_cpu
    WHEN 'Grave' THEN 1
    ELSE 0 END) as qtd_grave
from status where 
data_hora between cast(dateadd(MINUTE, -${i + 1}, convert(smalldatetime, getdate())) as smalldatetime) 
  and cast(dateadd(MINUTE, -${i}, convert(smalldatetime, getdate())) as smalldatetime)
and (
status_ram = 'Ok' or status_hd = 'Ok' or status_cpu = 'Ok' or
status_ram = 'Alerta' or status_hd = 'Alerta' or status_cpu = 'Alerta' or
status_ram = 'Grave' or status_hd = 'Grave' or status_cpu = 'Grave'
)`)
      .then((results) => {
        dados = results.recordset;
        numeroOcorrenciasOk.push(dados[0].qtd_ok);
        numeroOcorrenciasAlerta.push(dados[0].qtd_alerta);
        numeroOcorrenciasGrave.push(dados[0].qtd_grave);

        if (i == 7) {
          dados_formatados = {
            qtdOk: numeroOcorrenciasOk,
            qtdAlerta: numeroOcorrenciasAlerta,
            qtdGrave: numeroOcorrenciasGrave
          }

          console.log(dados_formatados);
          res.send(dados_formatados);

          i =0;

        }
      })
      .catch((err) => {

        console.log(err)
        res.render('error');
  
      })
  }




})


router.get('/laststatus', (req, res, next) => {
  dados = {}
  arrayRam = [];
  arrayCpu = [];
  arrayHD = [];
  arrayNomeLoja = [];
  arrayEndereco = [];
  arrayUtilizado = [];
  arrayData = [];
  arrayhora = [];
  global.conn.request()
    .query(`
    select * from STATUS s
    inner join (
    select max(data_hora) as data_hora, COMPUTADOR from status group by COMPUTADOR) a
    on s.data_hora = a.data_hora and a.COMPUTADOR = s.COMPUTADOR
    inner join(
    select * from COMPUTADOR) c
    on c.ID_COMPUTADOR = a.COMPUTADOR
    inner join(
    select ID_LOJA, NM_LOJA, TELEFONE, LOJA.ID_ENDERECO, ESTADO, CIDADE, BAIRRO, LOGRADOURO, NUMERO_ENDERECO
    from LOJA,ENDERECO where LOJA.ID_ENDERECO = ENDERECO.ID_ENDERECO) l
    on l.ID_LOJA = c.FK_ID_LOJA
    `)
    .then((results) => {
      var dados = results.recordset;

      // CRIAÇÃO DOS ARRAYS COM AS INFORMAÇÕES RETORNADAS DO BANCO

      for (var i = 0; i < dados.length; i++) {

        arrayRam[i] = dados[i].STATUS_RAM;
        arrayCpu[i] = dados[i].STATUS_CPU;
        arrayHD[i] = dados[i].STATUS_HD;
        arrayHD[i] = dados[i].STATUS_HD;
        arrayEndereco[i] = dados[i].LOGRADOURO + ", " + dados[i].NUMERO_ENDERECO + ", " + dados[i].BAIRRO + ", " + dados[i].CIDADE + ", " + dados[i].ESTADO;
        arrayNomeLoja[i] = dados[i].NM_LOJA
      }
      // // COLOCANDO OS INFORMAÇÕES TRATADAS DENTRO DO OBJ DADOS PARA FAZER O ENVIO

      dados = {
        ram: arrayRam,
        cpu: arrayCpu,
        hd: arrayHD,
        endereco: arrayEndereco,
        nome: arrayNomeLoja,
      };

      // // ENVIO DAS INFORMAÇÕES COMO RESPOSTA

      res.send(dados);

    })
    .catch((err) => {

      console.log(err)
      res.render('error');

    })
})




module.exports = router;

