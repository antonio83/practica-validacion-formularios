'use strict';
$(document).ready(function() {
    $('#frmalta').validate({
            rules: {
                nombre: {
                    required: true,
                    remote: 'http://www.futbolistas.com/users.php'

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
                    required: true
                },
                url: {
                    url: true
                },
                edad: {
                    min: 0,
                    max: 110
                }
            },
            errorLabelContainer: '#errores',
            wrapper: 'p'
        }
        

    );

});
