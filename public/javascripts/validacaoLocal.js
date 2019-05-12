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

function ConsisteNumerico(tam, fld, e) {
        var key = '';
        var i = 0;
        var len = 0;
        var strCheck = '0123456789';
        var aux = '';
        var whichCode = (window.Event) ? e.which : e.keyCode;
        if (whichCode == 13 || whichCode == 8 || whichCode == 0)
            return true;  // Enter
        key = String.fromCharCode(whichCode);  // Get key value from key code
        if (strCheck.indexOf(key) == -1)
            return false;  // Not a valid key
        len = tam -1;
        aux = '';
        for(; i < len; i++)
            if (strCheck.indexOf(fld.value.charAt(i))!=-1)
                aux += fld.value.charAt(i);
        aux += key;
        fld.value = '';
        fld.value += aux;
        return false;
    }

function validacaoLocal(){
    var nmLoja = document.getElementById("NomeLoja");
    var estado = document.getElementById("Estado");
    var cidade = document.getElementById("Cidade");
    var cep = document.getElementById("CEP");
    var bairro = document.getElementById("Bairro");
    var nmEndereco = document.getElementById("NomeEndereco");
    var numero = document.getElementById("Numero");
    var complemento = document.getElementById("Complemento");
    var telefone = document.getElementById("Telefone");

    if(nmLoja.value == ""){
        nmLoja.focus();
        return false;
    }
    if(estado.value == ""){
       estado.focus();
       return false;
    }
    if(cidade.value == ""){
        cidade.focus();
        return false;
    }
    if(cep.value == "" || cep.value == null){
        cep.focus();
        return false;
    }
    if(bairro.value == ""){
        bairro.focus();
        return false;
    }
    if(nmEndereco.value == ""){
        nmEndereco.focus();
        return false;
    }
    if(numero.value == ""){
        numero.focus();
        return false;
    }          
    
}