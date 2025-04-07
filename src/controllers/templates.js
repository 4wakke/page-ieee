

export const forgotPasswordTemplate = (password) => {
    const template =  `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de Contraseña</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                    }
                    .content {
                        font-size: 16px;
                        color: #555;
                        margin-top: 10px;
                
                    }
                    .password-box {
                        font-size: 18px;
                        font-weight: bold;
                        color: #ffffff;
                        background: #007BFF;
                        padding: 10px;
                        display: inline-block;
                        border-radius: 5px;
                        margin-top: 15px;

                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777;
                    }
                    .text{
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Contraseña Provisional </div>
                    <div class="content">
                        <p class = "text">Has solicitado restablecer tu contraseña. A continuación, te proporcionamos una contraseña temporal:</p>
                        <div class="password-box">${password}</div>
                        <p class = "text">Por razones de seguridad, te recomendamos cambiar tu contraseña una vez que inicies sesión.</p>
                    </div>
                    <div class="footer">
                        Si no solicitaste este cambio, comunicate con soporte.
                    </div>
                </div>
            </body>
            </html>
        `
    return template
 };

 export const successRegisterTemplate = (data) => {
    const template =  `<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Confirmación de Registro - TEMSCON</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 650px;
                                margin: 30px auto;
                                background-color: #ffffff;
                                border-radius: 10px;
                                overflow: hidden;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                background-color: #002f6c; /* Azul oscuro */
                                padding: 20px;
                                text-align: center;
                            }
                            .content img {
                                max-width: 300px;
                                text-align: center;
                                display: block;
                                margin: 0 auto;
                            }
                            .title {
                                color: #ffffff;
                                font-size: 28px;
                                margin-top: 5px;
                                font-weight: bold;
                            }
                            .content {
                                padding: 30px;
                                text-align: left;
                                color: #333;
                            }
                            .highlight {
                                color: #d62828; /* Rojo vibrante */
                                font-weight: bold;
                            }
                            .info-table {
                                margin-top: 20px;
                                width: 100%;
                                border-collapse: collapse;
                            }
                            .info-table td {
                                padding: 10px;
                                border-bottom: 1px solid #eee;
                            }
                            .footer {
                                background-color: #002f6c;
                                color: #ffffff;
                                text-align: center;
                                padding: 15px;
                                font-size: 14px;
                            }
                            .btn {
                                display: inline-block;
                                background-color: #d62828;
                                color: #ffffff;
                                padding: 10px 20px;
                                margin-top: 20px;
                                text-decoration: none;
                                border-radius: 5px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <div class="title">¡Registro Exitoso!</div>
                            </div>
                            <div class="content">
                                <img src="https://i.imgur.com/x15Wli4.png" alt="Logo TEMSCON" >
                                <p>Hola <span class="highlight">${data.name} ${data.lastName}</span>,</p>

                                <p>Nos complace confirmarte que tu registro a la conferencia <strong>TEMSCON</strong> ha sido completado con éxito.</p>

                                <p>A continuación te compartimos los detalles de tu inscripción:</p>

                                <table class="info-table">
                                    <tr>
                                        <td><strong>Nombre:</strong></td>
                                        <td>${data.name} ${data.lastName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>País:</strong></td>
                                        <td>${data.country}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ocupación:</strong></td>
                                        <td>${data.occupation}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tipo de participación:</strong></td>
                                        <td>${data.participationType}</td>
                                    </tr>
                                </table>

                                <a href="http://ieeecolcaribeconference.com/" class="btn">Pagina de registro</a>

                                <p>Gracias por ser parte de esta experiencia. ¡Nos vemos en TEMSCON!</p>
                            </div>
                            <div class="footer">
                                © 2025 TEMSCON. Todos los derechos reservados.<br>
                                Síguenos en nuestras redes sociales para más novedades.
                            </div>
                        </div>
                    </body>
                    </html>
        `
    return template
 };