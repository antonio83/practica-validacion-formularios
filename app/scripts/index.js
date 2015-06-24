'use strict';
$(document).ready(function() {
    $('#frmalta').validate({
        rules: {
            usuario: {
                required: true,
                minlength: 4,
                remote: 'http://www.futbolistas.com/users.php'

            },
            password: {
                required: true
            },
            rpassword: {
                required: true,
                equalTo: '#password'
            },
            nombre: {
                required: true,
                remote: 'http://www.futbolistas.com/users.php'

            },
            apellidos: {
                required: true
            },
            telefono: {
                required: true,
                digits: true,
                minlength: 9,
                maxlength: 9
            },
            email: {
                email: true,
                required: true,
                remote: 'http://localhost/formulario-ajax/validar_email_db.php'
            },
            email2: {
                equalTo: '#email'
            },
            comentarios: {
                required: true,
            },
            demandante: {
                required: true
            },
            nif: {
                required: true,
                nifES: true
            },
            cif:{
                required: true,
                cif: true
            },
            documento: {
                required: true,
                nifES: {
                    depends: function() {
                        if ($("#particular").prop("checked") == true) {
                            return true;
                        } else
                            return false;
                                        }
            },
            cif: {
                    depends: function() {
                        if ($("#empresa").prop("checked") == true) {
                            return true;
                        } else
                            return false;
                                        }
                }
            },
            nombreEmpresa: {
                required: true
            },
            empresa: {
                required: true
            },
            direccion: {
                required: true
            },
            cp: {
                required: true,
                digits: true,
                minlength: 5,
                maxlength: 5,
                "#cp":true
            },
            localidad: {
                required: true
            },
            provincia: {
                required: true
            },
            pais: {
                required: true
            },
            iban: {
                required: true,
                iban: true
            },
            formadepago: {
                required: true
            },
        },
        messages: {
                    nombre: {
                        lettersonly: "Introduce sólo carácteres."
                    }
                }
    });

            submitHandler: function(frmalta) {
                var cantidad = ($('input:radio[name=pago]:checked').val());
                    if (cantidad == "mensual") {
                        var c = confirm("Ha elegido un modo de pago mensual,la cuota es de 50€");
                    } else if (cantidad == "trimestral") {
                        var c = confirm("Ha elegido un modo de pago trimestral,la cuota es de 140€");
                    } else {
                        var c = confirm("Ha elegido un modo de pago anual,la cuota es de 550€");
                    }
                if (c == true) {
                    form.submit();
                                }
},

});
