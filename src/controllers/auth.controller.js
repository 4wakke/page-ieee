import bcrypt from "bcrypt";
import { pool } from "../db.js";
import { createAccessToken } from "../libs/jwt.js";
import {isValidEmail,isValidPassword,isValidDocType,
  isValidPhoneNumber,isValidBirthDate,isValidName,
  isValidMembershipNumber,isValidGender,isValidTaxAmount,
  successResponse,errorResponse} from "./helpers.js"
import fetch from 'node-fetch';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = result[0]; // ✅ Primer objeto directamente
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

return res.json(user);
}; //* HECHO

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
  
    if (!isValidEmail(email))  return errorResponse(res,"Correo inválido",400);
    if (!isValidPassword(password)) return errorResponse(res,"Contraseña inválida",400);
    //if (!isValidDocType(docType)) return errorResponse(res,"Tipo de documento inválido'",400);
    if (!isValidPhoneNumber(phoneNumber)) return errorResponse(res,"Número de teléfono inválido",400);
    if (!isValidBirthDate(birthDate)) return errorResponse(res,"Fecha de nacimiento inválida",400)
    if (!isValidName(name) || !isValidName(lastName)) return errorResponse(res,"Nombre o Apellido inválido",400)
    if (!isValidGender(gender)) return errorResponse(res,"Género inválido",400);
    if (membershipNumber && !isValidMembershipNumber(membershipNumber)) return errorResponse(res,"Número de membresía inválido",400);
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

    const articlesValues = articles.map(article => `(${userId}, '${article.number}', ${article.pages})`).join(", ");
    const articlesQuery = `INSERT INTO articles (user_id, sequence, pages) VALUES ${articlesValues};`;
    const [resultArticles] = await pool.query(articlesQuery, articlesValues);
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
};//* HECHO

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

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT id, name, last_name, country, city, address, gender, birth_date, 
             doc_type, doc_number, affiliation, email, phone_number, occupation, 
             is_ieee_member, is_tems, membership_number, participation_type, 
             attendance_type, tax_amount, qty_articles, created_at 
      FROM users 
      WHERE id = ?;
    `;

    const [users] = await pool.query(query, [id]);

    if (users.length === 0) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    return successResponse(res, 'Usuario obtenido correctamente', users[0]);
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
    birth_date,
    docType,
    doc_number,
    affiliation,
    email,
    phone_number,
    occupation,
    is_ieee_member,
    isTems,
    membership_number,
    participation_type,
    attendance_type,
    tax_amount,
    qty_articles
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
      birth_date || existingUser[0].birth_date,
      docType || existingUser[0].doc_type,
      doc_number || existingUser[0].doc_number,
      affiliation || existingUser[0].affiliation,
      email || existingUser[0].email,
      phone_number || existingUser[0].phone_number,
      occupation || existingUser[0].occupation,
      is_ieee_member ?? existingUser[0].is_ieee_member,
      isTems ?? existingUser[0].is_tems,
      membership_number || existingUser[0].membership_number,
      participation_type || existingUser[0].participation_type,
      attendance_type || existingUser[0].attendance_type,
      tax_amount || existingUser[0].tax_amount,
      qty_articles || existingUser[0].qty_articles,
      id
    ];

    await pool.query(query, values);

    return successResponse(res, 'Usuario actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return errorResponse(res, 'Error al actualizar el usuario', 500, error.message);
  }
};

export const signout = (req, res) => {
  res.clearCookie('token');
  res.sendStatus(200);
}; //* HECHO

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

  return successResponse(res,"Precio calculado exitosamente",{"price":price})
}

export const profile = async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
  return res.json(result.rows[0]);
}; //* HECHO

export const processPayment = async (req, res) => {
  try {
    // Obtener el access token
    const requiredFields = ["amount","dollarRate","description"]
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
      return errorResponse(res,`Faltan los siguientes campos: ${missingFields.join(', ')}`,400)
    }

    const responseToken = await fetch("https://dev.cobru.co/token/refresh/", {
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
      const newCobru = {
      amount: Math.ceil(req.body.amount * req.body.dollarRate),
      description: req.body.description || "Pago por servicio",
      expiration_days: 7,
      payment_method_enabled: JSON.stringify({
        credit_card: true,
        pse: true,
      }),
      platform: "API",
    };

    const responseCobro = await fetch("https://dev.cobru.co/cobru/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
        "x-api-key": "process.env.x_api_key",
      },
      body: JSON.stringify(newCobru),
    });


    if (!responseCobro.ok) {
      return errorResponse(res,"Error al crear el cobro", 500,responseCobro.statusText)
    }

    const cobroResponse = await responseCobro.json();

    return successResponse(res,"Cobro creado exitosamente",
      {accesToken:access,cobro: cobroResponse,checkoutURL: `https://dev.cobru.co/${cobroResponse.url}`},200)
    
  } catch (error) {
    console.error("Error en el proceso de pago:", error);
    
    return errorResponse(res,"Error en el proceso de pago",400,error.message)
  }
};

export const checkPaymentStatus = async (req, res) => {
  const { paymentUrl, accessToken, userId, dollarRate } = req.query;

  try {
    if (!paymentUrl) {
      return errorResponse(res,"Falta la URL del cobro",400)
    }

    const response = await fetch(`https://dev.cobru.co/cobru_detail/${paymentUrl}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`, // Usa variable de entorno para el token
        "Content-Type": "application/json",
        "x-api-key": process.env.x_api_key,
      },
    });
    if (!response.ok) {
      return errorResponse(res,"Error al consultar el estado del cobro",400,response.statusText)
    }

    const paymentStatus = await response.json();

    paymentStatus.amountUSD = Math.floor(paymentStatus.amount / dollarRate);
    const statusMap = {
      0: 'Creado',
      1: 'En proceso',
      2: 'No pagado',
      3: 'Pagado',
      4: 'Reembolsado',
      5: 'Expirado'
    };
  
    paymentStatus.status = statusMap[paymentStatus.state] || 'Estado desconocido'; 
    
    const sql = `
        INSERT INTO payments (user_id, usd, cop, status, url) 
        VALUES (?, ?, ?,?,?)
      `;

    const values = [
        userId,
        Math.floor(paymentStatus.amountUSD / dollarRate),
        paymentStatus.amountUSD,
        paymentStatus.status,
        paymentUrl
      ];

    const [result] = await pool.query(sql, values);

    console.log("Pago registrado correctamente:", result);
    

    return res.json({
      success: true,
      message: "Estado del cobro consultado correctamente",
      results: paymentStatus,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error al consultar el estado del cobro:", error);
    return res.status(500).json({
      success: false,
      message: "Error al consultar el estado del cobro",
      error: error.message,
      statusCode: 500,
    });
  }
};

