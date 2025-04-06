import bcrypt from "bcrypt";
import { pool } from "../db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/jwt.js";
import fetch from 'node-fetch';
import {isValidEmail,isValidPassword,isValidDocType,
  isValidPhoneNumber,isValidBirthDate,isValidName,
  isValidMembershipNumber,isValidGender,isValidTaxAmount,
  successResponse,errorResponse} from "./helpers.js"
import {forgotPasswordTemplate} from "./templates.js"
import { access } from "fs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let cobruToken = ''
export const signin = async (req, res) => {
  const { email, password } = req.body;

  const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = result[0]; 
  if (!user) {
    return res.status(400).json({
      message: "El correo no está registrado",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      message: "Contraseña incorrecta",
    });
  }

  const token = await createAccessToken({ id: user.id });

  res.cookie("token", token, {
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 1 día
  });

  return successResponse(res,"Usuario logado correctamente",user,200);
}

export const signup = async (req, res, next) => {
  const {
    name,
    lastName,
    password,
    country,
    city,
    address,
    gender,
    birthDate,
    docType,
    docNumber,
    affiliation,
    email,
    phoneNumber,
    occupation,
    isIeeeMember,
    isTems,
    membershipNumber,
    participationType,
    attendanceType,
    taxAmount,
    qtyArticles,
    articles
  } = req.body;

  try {
  
    if (!isValidEmail(email))  return errorResponse(res,"Correo electrónico inválido.",400);
    if (!isValidPassword(password)) return errorResponse(res,"La contraseña debe contener un mínimo de 8 caracteres, una mayúscula, una minúscula y un número.",400);
    if (!isValidPhoneNumber(phoneNumber)) return errorResponse(res,"Número de teléfono inválido",400);
    if (!isValidBirthDate(birthDate)) return errorResponse(res,"Fecha de nacimiento inválida",400)
    if (!isValidName(name) || !isValidName(lastName)) return errorResponse(res,"Nombre o Apellido inválido",400)
    if (!isValidGender(gender)) return errorResponse(res,"Género inválido",400);
    if (!isValidTaxAmount(taxAmount)) return errorResponse(res,"Impuesto inválido",400)

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (
        name, last_name, password, country, city, address,
        gender, birth_date, doc_type, doc_number, affiliation,
        email, phone_number, occupation, is_ieee_member,is_tems,
        membership_number, participation_type, attendance_type,
        tax_amount, qty_articles,created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,NOW())
    `;

    const values = [
      name,
      lastName,
      hashedPassword,
      country,
      city,
      address,
      gender,
      birthDate,
      docType,
      docNumber,
      affiliation,
      email,
      phoneNumber,
      occupation,
      isIeeeMember,
      isTems,
      membershipNumber,
      participationType,
      attendanceType,
      taxAmount,
      qtyArticles
    ];

    const [result] = await pool.query(query, values);
    const userId = result.insertId;
    if (articles.length > 0) {
      const articlesValues = articles.map(article => `(${userId}, '${article.sequence}', ${article.pages})`).join(", ");
      const articlesQuery = `INSERT INTO articles (user_id, sequence, pages) VALUES ${articlesValues};`;
      await pool.query(articlesQuery);
    }
    
    const token = await createAccessToken({ id: userId });

    res.cookie("token", token, {
      //secure: true,
      //sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    });

    return successResponse(res,"Usuario registrado correctamente",[{"userId":userId}])
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return errorResponse(res,"El correo ya está registrado",400,error.message)
    }
    return errorResponse(res,"Error al registrar el usuario",400,error.message)
  
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT id, name, last_name, country, city, address, gender, birth_date, 
             doc_type, doc_number, affiliation, email, phone_number, occupation, 
             is_ieee_member, is_tems, membership_number, participation_type, 
             attendance_type, tax_amount, qty_articles, created_at 
      FROM users;
    `;

    const [users] = await pool.query(query);

    return successResponse(res, 'Usuarios obtenidos correctamente', users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return errorResponse(res, 'Error al obtener los usuarios', 500, error.message);
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const email = req.query.email
  try {
    const query = `
      SELECT u.id, name, last_name AS lastName, country, city, address, gender,
             CAST(birth_date AS DATE) AS birthDate, doc_type AS docType, doc_number AS docNumber, 
             affiliation, email, phone_number AS phoneNumber, occupation, 
             is_ieee_member AS isIeeeMember, is_tems isTems, membership_number AS membershipNumber,
              participation_type AS participationType, attendance_type AS attendanceType, 
              tax_amount AS taxAmount, qty_articles AS qtyArticles ,
             json_arrayagg(
              json_object(
                  'sequence',a.sequence,
                  'pages',a.pages
              )
            ) AS articles
      FROM users u
      LEFT JOIN articles a ON a.user_id = u.id
      WHERE u.id = ? OR email = ?
      GROUP BY u.id;
    `;

    const [users] = await pool.query(query, [id, email]);
    if (users.length === 0) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
    
    const formattedUsers = users.map(user => ({
      ...user,
      birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : null
    }));

    return successResponse(res, 'Usuario obtenido correctamente', formattedUsers[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return errorResponse(res, 'Error al obtener el usuario', 500, error.message);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    lastName,
    password,
    country,
    city,
    address,
    gender,
    birthDate,
    docType,
    docNumber,
    affiliation,
    email,
    phoneNumber,
    occupation,
    isIeeeMember,
    isTems,
    membershipNumber,
    participationType,
    attendanceType,
    taxAmount,
    qtyArticles,
    articles,
    dollarRate
  } = req.body;

  try {
    // Verifica si el usuario existe
    const [existingUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Hashear la contraseña si es que se envía una nueva
    let hashedPassword = existingUser[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const query = `
      UPDATE users 
      SET name = ?, last_name = ?, password = ?, country = ?, city = ?, address = ?, 
          gender = ?, birth_date = ?, doc_type = ?, doc_number = ?, affiliation = ?, 
          email = ?, phone_number = ?, occupation = ?, is_ieee_member = ?, is_tems = ?, 
          membership_number = ?, participation_type = ?, attendance_type = ?, 
          tax_amount = ?, qty_articles = ?
      WHERE id = ?;
    `;

    const values = [
      name || existingUser[0].name,
      lastName || existingUser[0].last_name,
      hashedPassword,
      country || existingUser[0].country,
      city || existingUser[0].city,
      address || existingUser[0].address,
      gender || existingUser[0].gender,
      birthDate || existingUser[0].birth_date,
      docType || existingUser[0].doc_type,
      docNumber || existingUser[0].doc_number,
      affiliation || existingUser[0].affiliation,
      email || existingUser[0].email,
      phoneNumber || existingUser[0].phone_number,
      occupation || existingUser[0].occupation,
      isIeeeMember ?? existingUser[0].is_ieee_member,
      isTems ?? existingUser[0].is_tems,
      membershipNumber || existingUser[0].membership_number,
      participationType || existingUser[0].participation_type,
      attendanceType || existingUser[0].attendance_type,
      taxAmount || existingUser[0].tax_amount,
      qtyArticles || existingUser[0].qty_articles,
      id
    ];

    await pool.query(query, values);

    if (articles){
      if (!Array.isArray(articles) || articles.some(a => !sequence || !a.pages)) {
        return errorResponse(res,"El campo 'articles' debe ser un array de objetos con 'sequence' y 'pages'", 400)
      }
  
      if (articles.length !== qtyArticles) {
        return errorResponse(res,"La cantidad de artículos no coincide con 'qtyArticles'",400)
      }
  
      // Obtener artículos actuales del usuario en la base de datos
      const [existingArticles] = await pool.query(
        "SELECT sequence, pages FROM articles WHERE user_id = ?",
        [id]
      );
  
      // Convertir a mapa para comparación rápida
      const existingMap = new Map(existingArticles.map(a => [a.sequence, a.pages]));
      const newMap = new Map(articles.map(a => [a.sequence, a.pages]));
  
      // Identificar artículos para actualizar, insertar y eliminar
      const updates = [];
      const inserts = [];
      const deletes = [];
  
      // Revisar si hay que actualizar o eliminar
      for (const [sequence, pages] of existingMap.entries()) {
        if (!newMap.has(sequence)) {
          deletes.push(sequence); // Si no está en el nuevo array, eliminarlo
        } else if (newMap.get(sequence) !== pages) {
          updates.push({ sequence, pages: newMap.get(sequence) }); // Si cambió, actualizarlo
        }
      }
  
      // Revisar si hay que insertar nuevos artículos
      for (const [sequence, pages] of newMap.entries()) {
        if (!existingMap.has(sequence)) {
          inserts.push({ id, sequence, pages });
        }
      }
  
      // Ejecutar consultas
      if (updates.length > 0) {
        for (const { sequence, pages } of updates) {
          await pool.query(
            "UPDATE articles SET pages = ? WHERE user_id = ? AND sequence = ?",
            [pages, id, sequence]
          );
        }
      }
  
      if (deletes.length > 0) {
        await pool.query(
          "DELETE FROM articles WHERE user_id = ? AND sequence IN (?)",
          [id, deletes]
        );
      }
  
      if (inserts.length > 0) {
        await pool.query(
          "INSERT INTO articles (user_id, sequence, pages) VALUES ?",
          [inserts.map(({ id, sequence, pages }) => [id, sequence, pages])]
        );
      }

    }

    const dataPayment = [
      occupation || existingUser[0].occupation,
      isIeeeMember ?? existingUser[0].is_ieee_member,
      isTems ?? existingUser[0].is_tems,
      participationType || existingUser[0].participation_type,
      taxAmount || existingUser[0].tax_amount,
      qtyArticles || existingUser[0].qty_articles,
      articles || []
    ]

    const newPayment = payment(dataPayment)

    if(!newPayment.success){
        errorResponse(res,"Error al calcular el nuevo valor de pago",400,newPayment.error)
    }
    
    const paymentQuery = "SELECT * FROM payments WHERE user_id = ?"
    const infoPayment = await pool.query(paymentQuery, id);
    const newPrice = newPayment.results.pric
    if (infoPayment.length > 0) {
      if (infoPayment.usd != newPrice) {
        if (!["En proceso", "Creado"].includes(infoPayment.status)){
          const processData = [{
            "amount": newPrice ,
            "dollarRate":dollarRate,
            "description": `Pago auxiliar de ${name || existingUser[0].name} ${ lastName || existingUser[0].last_name}`,
            "userId":id
          }]
          processPayment(processData)
        } else {
            
        }
      }
      // Validar si se pago o no se pago. Si se pago se crea un nuevo pago con el valor seleccionado y si no se pago se hace un update al campo
    }

    return successResponse(res, 'Usuario actualizado correctamente');
    
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return errorResponse(res, 'Error al actualizar el usuario', 500, error.message);
  }
};

export const profile = async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
  return res.json(result.rows[0]);
};
export const signout = (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);

  return successResponse(res,"Sesión cerrada correctamente",{})
};

export const payment = (req,res) =>{
  const data = req.body
  let price = 0

  const requiredFields = ["participationType","isIeeeMember","isTems","occupation","qtyArticles","articles"]
  const missingFields = requiredFields.filter(field => !(field in req.body));
  if (missingFields.length > 0) {
    return errorResponse(res,`Faltan los siguientes campos: ${missingFields.join(', ')}`,400)
  }

  if (data.participationType == "author"){
    if (data.isIeeeMember){
      if (data.isTems){
        price = 300
      } else {
        price = 350
      }
    } else {
      price = 400
    }
  } else if (data.participationType == "attendee") {
    if (data.isIeeeMember){
      price = 184
    } else {
      if (data.occupation=="student"){
        price = 200    
      } else {
        price = 250
      }
    }
  }
  
  if (data.qtyArticles > 1) {
    price+=(100*(data.qtyArticles-1))
  }
  
  data.articles.forEach(article => {
    if (article.pages > 6) {
      price += 80 * (article.pages - 6);
    }
  });

  if (data.taxAmount && data.taxAmount > 0) {
      price +=price*taxAmount/100
  }

  return successResponse(res,"Precio calculado exitosamente",{"price":price})
};

const getRefreshToken = async (res) => {

  const responseToken = await fetch(`https://${process.env.cobru_url}/token/refresh/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": "process.env.x_api_key",
    },
    body: JSON.stringify({ refresh: process.env.refresh_token }),
  });

  if (!responseToken.ok) {
    return errorResponse(res,"Error al obtener el token de acceso",400,responseToken.statusText)
  }

  const { access } = await responseToken.json();
  cobruToken = access
}

export const processPayment = async (req, res) => {
  try {
  
    const requiredFields = ["amount","dollarRate","description","userId"]
    const missingFields = requiredFields.filter(field => !(field in req.body));
    const data = req.body
    if (missingFields.length > 0) {
      return errorResponse(res,`Faltan los siguientes campos: ${missingFields.join(', ')}`,400)
    } 
      if (cobruToken || isTokenExpired(cobruToken) ){
        await getRefreshToken(res)
      }
      const copAmount = Math.ceil(data.amount * data.dollarRate)
      const newCobru = {
        amount: copAmount ,
        description: data.description || "Pago por servicio",
        expiration_days: 7,
        payment_method_enabled: JSON.stringify({
          credit_card: true,  
          pse: true,
        }),
        platform: "API",
    };

    const responseCobro = await fetch(`https://${process.env.cobru_url}/cobru/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${cobruToken}`,
        "Content-Type": "application/json",
        "x-api-key": "process.env.x_api_key",
      },
      body: JSON.stringify(newCobru),
    });

    if (!responseCobro.ok) {
      return errorResponse(res,"Error al crear el cobro", 500,responseCobro.statusText)
    }

    const cobroResponse = await responseCobro.json();
    
    const sql = `
      INSERT INTO payments (user_id, usd, cop, status, url) 
      VALUES (?, ?, ?,?,?)
    `;

    const values = [
        data.userId,
        data.amount,
        copAmount,
        'Creado',
        cobroResponse.url
      ];
    const [result] = await pool.query(sql, values);
    return successResponse(res,"Cobro creado exitosamente",
      {cobro: cobroResponse,checkoutURL: `https://${process.env.cobru_url}/${cobroResponse.url}`},200)
    
  } catch (error) {
    console.error("Error en el proceso de pago:", error);
    
    return errorResponse(res,"Error en el proceso de pago",400,error.message)
  }
};

export const checkPaymentStatus = async () => {
  try {
    // Consultar todos los pagos activos
    const [payments] = await pool.query("SELECT * FROM payments WHERE status IN ('Creado','En proceso')");

    if (payments.length === 0) {
      console.log("No hay pagos pendientes de revisión.");
      return;
    }

    if (isTokenExpired(cobruToken)) {
      await getRefreshToken();
    }
    const results = await Promise.all(
      payments.map(async (payment) => {
        if (!payment.url) {
          console.error(`Falta la URL para el pago con ID ${payment.id}`);
          return null;
        }

        try {
          const response = await fetch(`https://${process.env.cobru_url}/cobru_detail/${payment.url}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${cobruToken}`,
              "Content-Type": "application/json",
              "x-api-key": process.env.x_api_key,
            },
          });

          if (!response.ok) {
            console.error(`Error al consultar estado del pago ${payment.id}: ${response.statusText}`);
            return null;
          }

          const paymentStatus = await response.json();

          // Convertir el estado del pago a su correspondiente descripción
          const statusMap = {
            0: "Creado",
            1: "En proceso",
            2: "No pagado",
            3: "Pagado",
            4: "Reembolsado",
            5: "Expirado",
          };

          const newStatus = statusMap[paymentStatus.state] || "Estado desconocido";

          // Si el estado cambió, actualizar en la base de datos
          if (newStatus !== payment.status) {
            await pool.query("UPDATE payments SET status = ? WHERE id = ?", [newStatus, payment.id]);
            console.log(`Estado actualizado para el pago ${payment.id}: ${payment.status} -> ${newStatus}`);
          }

          return { id: payment.id, status: newStatus };
        } catch (err) {
          console.error(`Error al procesar pago ${payment.id}:`, err);
          return null;
        }
      })
    );

    console.log("Proceso de actualización de pagos finalizado.");
    return results.filter((r) => r !== null);
  } catch (error) {
    console.error("Error general en la verificación de pagos:", error);
  }
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true; 
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return true;
  }
};

export const forgotPassword = async (req,res)=> {
  const { email } = req.body;

  try {
    // Buscar si el usuario existe
    const query = "SELECT id FROM users WHERE email = ?";
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const userId = rows[0].id;

    const newPassword = crypto.randomBytes(8).toString("hex").slice(0, 8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
    await pool.query(updateQuery, [hashedPassword, userId]);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de contraseña",
      html: forgotPasswordTemplate(newPassword),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Correo de recuperación enviado" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al restablecer la contraseña", error: error.message });
  }
};

export const changePassword = async(req,res) => {
  const data = req.body
  const requiredFields = ["oldPassword","newPassword","userId"]
  const missingFields = requiredFields.filter(field => !(field in data));
  if (missingFields.length > 0) {
    return errorResponse(res,`Faltan los siguientes campos: ${missingFields.join(', ')}`,400)
  }

  const [result] = await pool.query("SELECT password FROM users WHERE id = ?", [data.userId]);
  const user = result[0]; 

  const validPassword = await bcrypt.compare(data.oldPassword, user.password);
  if (!validPassword) {
    return errorResponse(res,"Contraseña Incorrecta",400)
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  const query = " UPDATE users SET password = ? WHERE id = ?"
  await pool.query(query, [hashedPassword ,data.userId]);

  return successResponse(res,"Contraseña actualizada correctamente",{"userId":data.userId},200)

}