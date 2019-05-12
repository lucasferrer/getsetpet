const LocalStrategy = require('passport-local').Strategy
const Cryptr = require('cryptr');

module.exports = function (passport) {
    
    
    //configuraremos o passport aqui

    passport.serializeUser(function (username, done) {

        done(null, username);
    });

    passport.deserializeUser(function (username, done) {
        // let id = resultado[0].idUsuario;
        // global.conn.request().query(`select login, nm_usuario, idUsuario, FK_acesso as idAcesso, 
        // FK_loc_trabalho as idLocalidade from usuarios where idUsuario = '${id}'`)
        // .then((results)=>{
        //     let resultado = results.recordsets[0];
            
        
        // }).catch((err) =>{
            //     console.log(err);
            // });
                done(null, username);
        
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        (username, password, done) => {
        const cryptr = new Cryptr('myTotalySecretKey');
        var passwd = cryptr.encrypt(password);
            // query comparando as senhas
            global.conn.request().query(`select NOME, USERNAME, EMAIL, FK_NV_ACESSO
            from USUARIO where USERNAME = '${username}' OR EMAIL = '${username}' AND SENHA = '${passwd}' ;`)
        .then((results)=>{
            let resultado = results.recordset;
            // console.log(resultado);
            
                //Verifica se retornou usuário
               if(resultado.length == 0) {

                     return done(null, false)
                }
                                     
                // caso não entrar nos ifs anteriores retorna o usuário
                    return done(null, resultado)
                    
          
            }) // Caso der erro na procura de usuário
            .catch((err)=>{

                console.log(err);
            })
            }
    ));

    
}

// module.exports = function(passport){

//     function checkUser(username, password){
//         // global.db.collection("users").findOne({"username": username}, function(err, doc){
//         //     callback(err, doc);
//         // });
//         var user = "admin"
//         var pass = "admin"
//         if ((username == user) && (password == pass)){
//             return true
//         }
//     }
    
//     passport.serializeUser(function(user, done){
//         done(null,user._id);
//     });

//     passport.deserializeUser(function(id, done){
//         checkUser(id, function(err,user){
//             done(err, user);
//         });
//     });

//     passport.use(new LocalStrategy( { 
//         usernameField: 'username',
//         passwordField: 'password'
//     },
//   (username, password, done) => {
//     if(checkUser(username,password)){
//         return done(null, user)
//     }
//     // findUser(username, (err, user) => {
//     //   if (err) { return done(err) }

//     //   // usuário inexistente
//     //   if (!user) { return done(null, false) }

//     //   // comparando as senhas
//     //   bcrypt.compare(password, user.password, (err, isValid) => {
//     //     if (err) { return done(err) }
//     //     if (!isValid) { return done(null, false) }
//     //     return done(null, user)
//     //   })
//     // })
//   }
// ));

// }