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
      return next();
    }
    // return next()
    res.redirect('/login?notLogged=true');
  };
}


router.post('/cadusuario', authenticationMiddleware(), (req, res) => {

  const cryptr = new Cryptr('myTotalySecretKey');
  const nome = req.body.FirstName + " " + req.body.LastName;
  const email = req.body.InputEmail;
  const username = req.body.FirstName + "." + req.body.LastName;
  const senha = cryptr.encrypt(req.body.InputPassword);
  const nvAcesso = parseInt(req.body.NivelAcesso);

  // const decryptedString = cryptr.decrypt(senha);

  global.conn.request()
    .query(`insert into USUARIO (NOME, EMAIL, USERNAME, SENHA, FK_NV_ACESSO) values ('${nome}','${email}','${username}',PWDENCRYPT('${senha}'),'${nvAcesso}');`)
    .then((results) => {
      var linhasafetadas = results.rowsAffected;
      console.log("Rota de cadastro usuario ativada, Linhas Afetadas no banco: " + linhasafetadas);
      if (linhasafetadas.length != 0) {
        res.render('register', { data: data, title: title, message: "cadastro feito com sucesso" });
        // return res.json({message: "cadastro feito com sucesso"})
      }
    }) // Caso der erro na procura de usuário
    .catch((err) => {
      var erro = "" + err;
      var dpusuario = erro.indexOf(username);
      var dpemail = erro.indexOf(email);

      if (dpusuario != (-1)) {
        res.render('register', { data: data, title: title, message: "Usuario já cadastrado!" });
      }
      else if (dpemail != (-1)) {
        res.render('register', { data: data, title: title, message: "Email já cadastrado na base!" });
      }
      else{
      console.log(err);
      res.render('register', { data: data, title: title, message: "Erro inesperado, tente novamente!" });
    }
    });

});

router.post('/cadloja', authenticationMiddleware(), (req, res) =>{

  const loja = req.body.NomeLoja;
  const estado = req.body.Estado;
  const cidade = req.body.Cidade;
  const cep = req.body.CEP;
  const bairro = req.body.Bairro;
  const nmEndereco = req.body.NomeEndereco;
  const numero = req.body.Numero;
  const complemento = req.body.Complemento;
  const telefone = req.body.Telefone;

  global.conn.request()
    .query(`
    INSERT INTO ENDERECO(ESTADO, CIDADE, CEP, BAIRRO, NM_ENDERECO, NUMERO_ENDERECO, COMPLEMENTO) VALUES('${estado}', '${cidade}', '${cep}', '${bairro}', '${nmEndereco}', ${numero}, '${complemento}');
    DECLARE @ID INT;
    select @ID = ID_ENDERECO from ENDERECO WHERE ESTADO = '${estado}' and CIDADE = '${cidade}' and CEP = '${cep}' and BAIRRO = '${bairro}' and NM_ENDERECO = '${nmEndereco}' and NUMERO_ENDERECO = ${numero} and COMPLEMENTO = '${complemento}';
    insert into LOJA(NM_LOJA, TELEFONE, ID_ENDERECO) values('${loja}', '${telefone}', @ID);`)
    .then((results) =>{
      var linhasafetadas = results.rowsAffected;
      console.log("Rota de cadastro usuario ativada, Linhas Afetadas no banco: " + linhasafetadas);
      if (linhasafetadas.length != 0) {
        res.render('local', {title: title, message: "Registro realizado com sucesso"});
        // return res.json({message: "cadastro feito com sucesso"})
      }
    })
    .catch((err) => {

      console.log(err);
      res.render('local', { title: title, message: "Erro inesperado, tente novamente!" });

    });         
});

router.get('/lojatable', authenticationMiddleware(), (req,res,next) => {
  global.conn.request().query(`SELECT ID_LOJA AS ID, NM_LOJA AS Nome, TELEFONE AS Telefone, ESTADO AS Estado, CIDADE AS Cidade,
   CEP AS Cep, BAIRRO AS Bairro, NM_ENDERECO AS Endereco, NUMERO_ENDERECO AS Numero, COMPLEMENTO AS Complemento
    FROM LOJA, ENDERECO WHERE LOJA.ID_ENDERECO = ENDERECO.ID_ENDERECO;`)
    .then ((results) => {
      var resultadobd = results.recordset;

      res.render('lojatable', {title: title, username: req.session.passport.user[0].NOME, tabLojaKeys: Object.keys(resultadobd[0]), tabLojaData: resultadobd});
      console.log(resultadobd);  
    }).catch((err) => {

      console.log(err);
      res.render('error');
      
    });

});

router.get('/usertable', function(req,res,next){
  global.conn.request()
    .query(`
    select ID_USUARIO as ID, NOME as Nome, EMAIL as Email,USERNAME as Username, TIPO_ACESSO as Nivel_acesso from USUARIO, NV_ACESSO where FK_NV_ACESSO = ID_NV_ACESSO;`)
    .then((results) =>{
      var resultadobd = results.recordset;

      console.log(Object.keys(resultadobd[0]));
   
        res.render('usertable', {title: title, username: req.session.passport.user[0].NOME,tabUserKeys: Object.keys(resultadobd[0]), tabUserData: resultadobd});
        // return res.json({message: "cadastro feito com sucesso"})
      
    })
    .catch((err) => {

      console.log(err);
      res.render('error');

    });
  
});
router.get('/lojaedit', authenticationMiddleware(), (req,res) => {
  var nomeLoja = req.query.Nome;
  var telefone = req.query.Telefone;
  var estado = req.query.Estado;
  var cidade = req.query.Cidade;
  var cep = req.query.Cep;
  var bairro = req.query.Bairro;
  var endereco = req.query.Endereco;
  var numero = req.query.Numero;
  var complemento = req.query.Complemento;

  var lojaInfo = [
    { id: req.query.idUser, NomeLj: nomeLoja, Estado: estado, Cidade: cidade, Cep: cep, Bairro: bairro, Endereco: endereco,
    Numero: numero, Complemento: complemento, Telefone: telefone }
  ];
  res.render('editloja', {title: title, lojainfo: lojaInfo, message: ""});

});

router.get('/useredit', function(req,res,next){

  var name = ""+ req.query.Nome;
  var splitnome = name.split(" ");
  var firstname = splitnome[0];
  var lastname = splitnome[1];
  if(splitnome.length > 2){
    for(i=2; i < name.length; i++){
      lastname += " "+ name[i];
    }
    
  }
  var userInfo = [
    { id: req.query.idUser, firstname: firstname, lastname: lastname, email: req.query.Email },
  ];

  res.render('edituser', { status: status, data: data,  title: title , message: "", userinfo: userInfo});
  
});

router.post('/useredit', function(req,res,next){
  var userInfo = [
    { id: '', firstname: '', lastname: '', email: '' },
  ];
  var lastnameparse = ""+ req.body.LastName;
  lastnameparse = lastnameparse.split(" ");
  const nome = req.body.FirstName + " " + req.body.LastName;
  const email = req.body.InputEmail;
  const username = req.body.FirstName + "." + lastnameparse[0];
  const nvAcesso = parseInt(req.body.NivelAcesso);
  
  // const decryptedString = cryptr.decrypt(senha);

  global.conn.request()
    .query(`update USUARIO set NOME='${nome}', EMAIL='${email}', USERNAME='${username}', FK_NV_ACESSO='${nvAcesso}' where EMAIL = '${email}';`)
    .then((results) => {
      var linhasafetadas = results.rowsAffected;
      console.log("Rota de edição usuario ativada, Linhas Afetadas no banco: " + linhasafetadas);
      if (linhasafetadas.length != 0) {
        res.render('edituser', {status: status, userinfo: userInfo, data: data, title: title, message: "cadastro feito com sucesso" });
        // return res.json({message: "cadastro feito com sucesso"})
      }
    }) // Caso der erro na procura de usuário
    .catch((err) => {
      var erro = "" + err;
      var dpusuario = erro.indexOf(username);
      var dpemail = erro.indexOf(email);

      if (dpusuario != (-1)) {
        res.render('edituser', {status: status, userinfo: userInfo, data: data, title: title, message: "Usuario já cadastrado!" });
      }
      else if (dpemail != (-1)) {
        res.render('edituser', {status: status, userinfo: userInfo, data: data, title: title, message: "Email já cadastrado na base!" });
      }
      else{
      console.log(err);
      res.render('edituser', {status: status, userinfo: userInfo, data: data, title: title, message: "Erro inesperado, tente novamente!" });
    }
    });
});

router.post('/editarloja', function(req,res) {
  var nomeLoja = req.body.NomeLoja;
  var telefone = req.body.Telefone;
  var estado = req.body.Estado;
  var cidade = req.body.Cidade;
  var cep = req.body.Cep;
  var bairro = req.body.Bairro;
  var endereco = req.body.NmEndereco;
  var numero = req.body.Numero;
  var complemento = req.body.Complemento;
  var estadoAntigo = req.query.Estado;
  var cidadeAntigo = req.query.Cidade;
  var cepAntigo = req.query.Cep;
  var bairroAntigo = req.query.Bairro;
  var enderecoAntigo = req.query.NmEndereco;
  var numeroAntigo = req.query.Numero;
  var complementoAntigo = req.query.Complemento;


  console.log( "esse é o nome da loja" +nomeLoja);

  var lojaInfo = [
    { id: req.query.idUser, NomeLj: nomeLoja, Estado: estado, Cidade: cidade, Cep: cep, Bairro: bairro, Endereco: endereco,
    Numero: numero, Complemento: complemento, Telefone: telefone }
  ];
  global.conn.request().query(`UPDATE `)
.then((results) =>{
  var linhasafetadas = results.rowsAffected;
  console.log("Rota de edição de loja ativada, Linhas Afetadas no banco: " + linhasafetadas);

    res.render('editloja', {title: title, message: "Alteração realizada com sucasso!"});

});

});

module.exports = router;

