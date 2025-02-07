import {pool} from '../db.js';

export const getDetails = (req, res, next) => {
  //console.log(req.headers);
  

// try {
//   const { result} = await pool.query("INSERT INTO task (title, description) VALUES ($1, $2)" RETURNING * , [title, description]);
// console.log(result);
// res.send('Task created');
// } 
//catch (error) {
// if (error.code === '23505') {
//   return res.status(400).send('Task already exists');
// }
//next(error);

  res.send('detalles del congreso')
};

export const getAdminList = (req, res) => {
  res.send('detalles de administradores')
}

export const createEvent = (req, res) => {
  res.send('creando evento');
}