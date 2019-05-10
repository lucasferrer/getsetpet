function textonly(e){
  var code;
  if (!e) var e = window.event;
  if (e.keyCode) code = e.keyCode;
  else if (e.which) code = e.which;
  var character = String.fromCharCode(code);
  //alert('Character was ' + character);
      //alert(code);
      //if (code == 8) return true;
      var AllowRegex  = /^[\ba-zA-Z\s-]$/;
      if (AllowRegex.test(character)) return true;     
      return false; 
}

function validEmail(e) {
  var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
  return (filter) != -1;
}

function validacao(){
  var email = document.getElementById("exampleInputEmail");
  var firstName = document.getElementById("exampleFirstName");
  var lastName = document.getElementById("exampleLastName");
  var password = document.getElementById("password");
  var passwordConfirm = document.getElementById("confirmPassword");

  if(password.value == ""){
    password.focus();
    return false;
  }

  if(password.value !== passwordConfirm.value){
    passwordConfirm.focus();
    return false;
  }
}
