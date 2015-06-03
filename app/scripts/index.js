'use strict';
$(document).ready(function() {
    $('#frmalta').validate({
        rules: {
            usuario: {
                required: true,
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
                maxlength: 5
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

});
