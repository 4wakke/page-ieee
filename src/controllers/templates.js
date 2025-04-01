

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
                    <div class="header">Contraseña Provisional/div>
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