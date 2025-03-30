import app from "./app.js";
import { pool } from "./db.js";

app.listen(3000, '0.0.0.0');
console.log("Server on port", 3000);
