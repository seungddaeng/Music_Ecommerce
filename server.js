const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'musicecommerce',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', db.threadId);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Error fetching products' });
    } else {
      res.json(results);
    }
  });
});

app.post('/registrar', (req, res) => {
  const { nombreCompleto, email, nuevaContrasena } = req.body;

  const hashedPassword = nuevaContrasena;

  const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [nombreCompleto, email, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error en el registro' });
    } else {
      res.json({ success: true, message: 'Registro exitoso' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post('/iniciar_sesion', (req, res) => {
  const { email, contrasena } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, contrasena], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error en el inicio de sesión' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, message: 'Inicio de sesión exitoso' });
      } else {
        res.json({ success: false, error: 'Correo o contraseña incorrectos' });
      }
    }
  });
});