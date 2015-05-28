'use strict';
$(document).ready(function() {
    $('#frmalta').validate({
            rules: {
                nombre: {
                    required: true,
                    remote: 'http://www.futbolistas.com/users.php'

                },
                apellidos: {
                    required: true
                },
                telefono: {
                    required: true
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
                demandante: {
                    required: true
                },
                nif: {
                    required: true
                },
                empresa: {
                    required: true
                },
                direccion: {
                    required: true
                },
                cp: {
                    required: true
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
                codigoiban: {
                    required: true
                },
                formadepago: {
                    required: true
                },
            },
            errorLabelContainer: '#errores',
            wrapper: 'p'
        }
        

    );

});
