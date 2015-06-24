//nif

jQuery.validator.addMethod("nifES", function(value) {
    "use strict";

    value = value.toUpperCase();

    // Basic format test
    if (!value.match("((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)")) {
        return false;
    }

    // Test NIF
    if (/^[0-9]{8}[A-Z]{1}$/.test(value)) {
        return ("TRWAGMYFPDXBNJZSQVHLCKE".charAt(value.substring(8, 0) % 23) === value.charAt(8));
    }
    // Test specials NIF (starts with K, L or M)
    if (/^[KLM]{1}/.test(value)) {
        return (value[8] === String.fromCharCode(64));
    }

    return false;

}, "Please specify a valid NIF number.");

jQuery.validator.addMethod("nowhitespace", function(value, element) {
    return this.optional(element) || /^\S+$/i.test(value);
}, "No white space please");


//iban

jQuery.validator.addMethod("iban", function(value, element) {
    // some quick simple tests to prevent needless work
    if (this.optional(element)) {
        return true;
    }

    // remove spaces and to upper case
    var iban = value.replace(/ /g, "").toUpperCase(),
        ibancheckdigits = "",
        leadingZeroes = true,
        cRest = "",
        cOperator = "",
        countrycode, ibancheck, charAt, cChar, bbanpattern, bbancountrypatterns, ibanregexp, i, p;

    if (!(/^([a-zA-Z0-9]{4} ){2,8}[a-zA-Z0-9]{1,4}|[a-zA-Z0-9]{12,34}$/.test(iban))) {
        return false;
    }

    // check the country code and find the country specific format
    countrycode = iban.substring(0, 2);
    bbancountrypatterns = {
        "AL": "\\d{8}[\\dA-Z]{16}",
        "AD": "\\d{8}[\\dA-Z]{12}",
        "AT": "\\d{16}",
        "AZ": "[\\dA-Z]{4}\\d{20}",
        "BE": "\\d{12}",
        "BH": "[A-Z]{4}[\\dA-Z]{14}",
        "BA": "\\d{16}",
        "BR": "\\d{23}[A-Z][\\dA-Z]",
        "BG": "[A-Z]{4}\\d{6}[\\dA-Z]{8}",
        "CR": "\\d{17}",
        "HR": "\\d{17}",
        "CY": "\\d{8}[\\dA-Z]{16}",
        "CZ": "\\d{20}",
        "DK": "\\d{14}",
        "DO": "[A-Z]{4}\\d{20}",
        "EE": "\\d{16}",
        "FO": "\\d{14}",
        "FI": "\\d{14}",
        "FR": "\\d{10}[\\dA-Z]{11}\\d{2}",
        "GE": "[\\dA-Z]{2}\\d{16}",
        "DE": "\\d{18}",
        "GI": "[A-Z]{4}[\\dA-Z]{15}",
        "GR": "\\d{7}[\\dA-Z]{16}",
        "GL": "\\d{14}",
        "GT": "[\\dA-Z]{4}[\\dA-Z]{20}",
        "HU": "\\d{24}",
        "IS": "\\d{22}",
        "IE": "[\\dA-Z]{4}\\d{14}",
        "IL": "\\d{19}",
        "IT": "[A-Z]\\d{10}[\\dA-Z]{12}",
        "KZ": "\\d{3}[\\dA-Z]{13}",
        "KW": "[A-Z]{4}[\\dA-Z]{22}",
        "LV": "[A-Z]{4}[\\dA-Z]{13}",
        "LB": "\\d{4}[\\dA-Z]{20}",
        "LI": "\\d{5}[\\dA-Z]{12}",
        "LT": "\\d{16}",
        "LU": "\\d{3}[\\dA-Z]{13}",
        "MK": "\\d{3}[\\dA-Z]{10}\\d{2}",
        "MT": "[A-Z]{4}\\d{5}[\\dA-Z]{18}",
        "MR": "\\d{23}",
        "MU": "[A-Z]{4}\\d{19}[A-Z]{3}",
        "MC": "\\d{10}[\\dA-Z]{11}\\d{2}",
        "MD": "[\\dA-Z]{2}\\d{18}",
        "ME": "\\d{18}",
        "NL": "[A-Z]{4}\\d{10}",
        "NO": "\\d{11}",
        "PK": "[\\dA-Z]{4}\\d{16}",
        "PS": "[\\dA-Z]{4}\\d{21}",
        "PL": "\\d{24}",
        "PT": "\\d{21}",
        "RO": "[A-Z]{4}[\\dA-Z]{16}",
        "SM": "[A-Z]\\d{10}[\\dA-Z]{12}",
        "SA": "\\d{2}[\\dA-Z]{18}",
        "RS": "\\d{18}",
        "SK": "\\d{20}",
        "SI": "\\d{15}",
        "ES": "\\d{20}",
        "SE": "\\d{20}",
        "CH": "\\d{5}[\\dA-Z]{12}",
        "TN": "\\d{20}",
        "TR": "\\d{5}[\\dA-Z]{17}",
        "AE": "\\d{3}\\d{16}",
        "GB": "[A-Z]{4}\\d{14}",
        "VG": "[\\dA-Z]{4}\\d{16}"
    };

    bbanpattern = bbancountrypatterns[countrycode];
    // As new countries will start using IBAN in the
    // future, we only check if the countrycode is known.
    // This prevents false negatives, while almost all
    // false positives introduced by this, will be caught
    // by the checksum validation below anyway.
    // Strict checking should return FALSE for unknown
    // countries.
    if (typeof bbanpattern !== "undefined") {
        ibanregexp = new RegExp("^[A-Z]{2}\\d{2}" + bbanpattern + "$", "");
        if (!(ibanregexp.test(iban))) {
            return false; // invalid country specific format
        }
    }

    // now check the checksum, first convert to digits
    ibancheck = iban.substring(4, iban.length) + iban.substring(0, 4);
    for (i = 0; i < ibancheck.length; i++) {
        charAt = ibancheck.charAt(i);
        if (charAt !== "0") {
            leadingZeroes = false;
        }
        if (!leadingZeroes) {
            ibancheckdigits += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(charAt);
        }
    }

    // calculate the result of: ibancheckdigits % 97
    for (p = 0; p < ibancheckdigits.length; p++) {
        cChar = ibancheckdigits.charAt(p);
        cOperator = "" + cRest + "" + cChar;
        cRest = cOperator % 97;
    }
    return cRest === 1;
}, "Please specify a valid IBAN");


//cif

jQuery.validator.addMethod('cif', function(value, element) {
    value = value.replace(/[\s-]/g, ""); // quitar espacios o guiones
    par = 0;
    non = 0;
    letras = "ABCDEFGHKLMNPQS";
    let = value.charAt(0);
    if (value.length == 0) {
        return true;
    }
    if (value.length != 9) {
        //alert('El Cif debe tener 9 dígitos');
        return false;
    }
    if (letras.indexOf(let.toUpperCase()) == -1) {
        //alert("El comienzo del Cif no es válido");
        return false;
    }
    for (zz = 2; zz < 8; zz += 2) {
        par = par + parseInt(value.charAt(zz));
    }
    for (zz = 1; zz < 9; zz += 2) {
        nn = 2 * parseInt(value.charAt(zz));
        if (nn > 9) nn = 1 + (nn - 10);
        non = non + nn;
    }
    parcial = par + non;
    control = (10 - (parcial % 10));
    if (control == 10) {
        control = 0;
    }
    if (control != value.charAt(8)) {
        //alert("El Cif no es válido");
        return false;
    }
    //alert("El Cif es válido");
    return true;
}, "CIF incorrecto");


//email2


jQuery.validator.addMethod("email2", function(value, element, param) {
    return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
}, jQuery.validator.messages.email);


//cuenta bancaria


jQuery.validator.addMethod('validacuentabanco', function(value, element, param) {
	var banco = value.substring(0,4);
    var sucursal = value.substring(4,8);
    var dc = value.substring(8,10);
    var cuenta=value.substring(10,20);
    var CCC = banco+sucursal+dc+cuenta;
    var i;
    if (!/^[0-9]{20}$/.test(CCC)){
        return false;
    }
    else
    {
        valores = new Array(1, 2, 4, 8, 5, 10, 9, 7, 3, 6);
        control = 0;
        for (i=0; i<=9; i++)
        control += parseInt(cuenta.charAt(i)) * valores[i];
        control = 11 - (control % 11);
        if (control == 11) control = 0;
        else if (control == 10) control = 1;
        if(control!=parseInt(dc.charAt(1))) {
            return false;
        }
        control=0;
        var zbs="00"+banco+sucursal;
        for (i=0; i<=9; i++)
            control += parseInt(zbs.charAt(i)) * valores[i];
        control = 11 - (control % 11);
        if (control == 11) control = 0;
            else if (control == 10) control = 1;
        if(control!=parseInt(dc.charAt(0))) {
            return false;
        }
        return true;
    }
}, 'Introduce un número de cuenta válido.');


 // SI ES PARTICULAR, RELLENAR CAMPO DE NOMBRE(EN APARTADO FACTURACION) CON DATOS DE CONTACTO
$("#apellidos").focusout(function() {
    var caracteresNombre = $("#nombre").val();
    var caracteresApellido = $("#apellidos").val();
                if (caracteresApellido.length > 4)
                    $("#empresa").val(caracteresNombre + " " + caracteresApellido);
            });



//cp

// RELLENAR EL CODIGO POSTAL CON 0 A LA IZQUIERDA
$("#cp").focusout(function() {
var campoCP = $("#cp").val();
var cont = 0;
while (campoCP.length < 5) {
campoCP = "0" + campoCP;
cont++;
}
$("#cp").val(campoCP);

// ARRAY PARA CODIGO POSTAL Y PROVINCIA
var prov = new Array();
prov[0] = "NO HAY PROVINCIA";
prov[1] = "Alava";
prov[2] = "Albacete";
prov[3] = "Alicante";
prov[4] = "Almeria";
prov[5] = "Avila";
prov[6] = "Badajoz";
prov[7] = "Illes Balears";
prov[8] = "Barcelona";
prov[9] = "Burgos";
prov[10] = "Caceres";
prov[11] = "Cadiz";
prov[12] = "Castellon";
prov[13] = "Ciudad Real";
prov[14] = "Cordoba";
prov[15] = "A Coruña";
prov[16] = "Cuenca";
prov[17] = "Girona";
prov[18] = "Granada";
prov[19] = "Guadalajara";
prov[20] = "Guipuzcoa";
prov[21] = "Huelva";
prov[22] = "Huesca";
prov[23] = "Jaen";
prov[24] = "Leon";
prov[25] = "Lleida";
prov[26] = "La Rioja";
prov[27] = "Lugo";
prov[28] = "Madrid";
prov[29] = "Malaga";
prov[30] = "Murcia";
prov[31] = "Navarra";
prov[32] = "Ourense";
prov[33] = "Asturias";
prov[34] = "Palencia";
prov[35] = "Las Palmas";
prov[36] = "Pontevedra";
prov[37] = "Salamanca";
prov[38] = "S.C. Tenerife";
prov[39] = "Cantabria";
prov[40] = "Segovia";
prov[41] = "Sevilla";
prov[42] = "Soria";
prov[43] = "Tarragona";
prov[44] = "Teruel";
prov[45] = "Toledo";
prov[46] = "Valencia";
prov[47] = "Valladolid";
prov[48] = "Vizcaya";
prov[49] = "Zamora";
prov[50] = "Zaragoza";
prov[51] = "Ceuta";
prov[52] = "Melilla";

$cp = $("#cp").val();
$zip = $cp.substr(0, 2);

if ($zip == 00 || $cp < 1000 || $cp > 52999) {
alert("Codigo postal erroneo");
}
// Para asociarlo mas facilmente con el array de provincias,
// si zip tiene 0 en el primer caracter, lo quitamos
if ($zip.substr(0, 1) == 0) {
$zip = $cp.substr(1, 1);
}
// Ahora metemos el nombre de la provincia en su campo, que corresponde con su cp
$("#provincia").val(prov[$zip]);
$("#localidad").val(prov[$zip]);
});

//particular o empresa

//empresa
$("#empresa").click(function(evento) {
$('#labeldocumento').text("CIF");
$("#nombreEmpresa").val("");
});

//particular
$("#particular").click(function(evento) {
$('#labeldocumento').text("NIF");
var nombre = $("#nombre").val();
var apellidos = $("#apellidos").val();
$("#nombreEmpresa").val(nombre + " " + apellidos);
});









/*
//cp

// Ajax para consultar en la base de datos
$.ajax({
url: "php/cp.php",
type: "POST",
data: "zip=" + $("#cp").val(),
success: function(a) {
$("#localidad").html(a);
}
});
}); // FIN DEL CP CON CEROS Y ASOCIACION
// CAMPO DEL USUARIO SE RELLENA CON EL CAMPO DE EMAIL2
$("#email2").focusout(function() {
$("#usuario").val($("#email2").val());
});
// CADA VEZ QUE INTRODUZCO UNA TECLA EN EL INPUT DE CONTRASEÑA, OBTENGO UN VALOR DEL PLUGIN COMPLEXIFY
$("#contrasenia").focusin(function() {
$("#contrasenia").complexify({}, function(valid, complexity) {
$("#nivelContrasenia").val(complexity);
});
});
// CAMBIO CON BOTON, PARTICULAR - EMPRESA
$("input:radio").click(function() {
if ($("#d_particular").is(":checked")) {
// PARTE DE CIF A NIF
$("#lblcif").html("NIF:");
$("#lblcif").attr({
"for": "nif",
"id": "lblnif"
});
$("#cif").attr({
"name": "nif",
"id": "nif"
});
// PARTE DE EMPRESA A NOMBRE
$("#lblnombreEmpresa").html("Nombre:");
$("#lblnombreEmpresa").attr({
"for": "nombreParticular",
"id": "lblnombreParticular"
});
$("#nombreEmpresa").attr({
"name": "nombreParticular",
"id": "nombreParticular"
});
$("#nombreParticular").val("");
} // FIN DEL IF
if ($("#d_empresa").is(":checked")) {
// PARTE DE NIF A CIF LABEL
$("#lblnif").html("CIF:");
$("#lblnif").attr({
"for": "cif",
"id": "lblcif"
});
$("#nif").attr({
"name": "cif",
"id": "cif"
});
// PARTE DE NOMBRE A EMPRESA
$("#lblnombreParticular").html("Empresa:");
$("#lblnombreParticular").attr({
"for": "nombreEmpresa",
"id": "lblnombreEmpresa"
});
$("#nombreParticular").attr({
"name": "nombreEmpresa",
"id": "nombreEmpresa"
});
$("#nombreEmpresa").val("");
} // FIN DEL IF
}); // FIN DEL EVENTO CLICK DE INPUT RADIO
}); // FIN DEL DOCUMENT READY
jQuery.validator.addMethod("complejidad", function(value, element) {
var barra = $("#nivelContrasenia").val();
if (barra < 20) {
return false;
} else {
return true;
}
}, "Debe introducir una contraseña mas segura.");



 // SI ES PARTICULAR, RELLENAR CAMPO DE NOMBRE(EN APARTADO FACTURACION) CON DATOS DE CONTACTO
$("#apellidos").focusout(function() {
if ($("#d_particular").is(":checked")) {
var nombre = $("#nombre").val();
var apellidos = $("#apellidos").val();
$("#nombreParticular").val(nombre + " " + apellidos);
}
});
// RELLENAR EL CODIGO POSTAL CON 0 A LA IZQUIERDA
$("#cp").focusout(function() {
var campoCP = $("#cp").val();
var cont = 0;
while (campoCP.length < 5) {
campoCP = "0" + campoCP;
cont++;
}
$("#cp").val(campoCP);
*/