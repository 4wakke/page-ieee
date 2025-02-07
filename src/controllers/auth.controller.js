import { pool } from "../db.js";

export const signin = (req, res) => {
  res.send("ingresando");
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const result = await pool.query(
    "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  console.log(result);

  return res.send("registrando");
};

export const signout = (req, res) => {
  res.send("cerrando sesión");
};

export const profile = (req, res) => {
  res.send("perfil del usuario");
};
