var express = require('express');
var router = express.Router();

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

router.post('/teste', function(req, res){
    var nome = req.body.FirstName;
    console.log(nome);

    res.redirect('/register?susess=true');
})



module.exports = router;

