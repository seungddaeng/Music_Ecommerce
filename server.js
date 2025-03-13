const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt'); 

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/payment', express.static(path.join(__dirname, 'payment')));


app.use(cors());

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products_details';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching products' });
    } else {
      console.log('Products fetched from DB:', results);
      res.json(results);
    }
  });
});
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Error fetching user' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(results[0]);
    }
  });
});

app.post("/registrar", (req, res) => {
  const { nombreCompleto, email, nuevaContrasena } = req.body;

  if (!nombreCompleto || !email || !nuevaContrasena) {
      return res.status(400).json({ success: false, error: "Todos los campos son obligatorios" });
  }

  bcrypt.hash(nuevaContrasena, 10, (err, hash) => {
      if (err) {
          return res.status(500).json({ success: false, error: "Error al encriptar contraseña" });
      }

      const sql = "INSERT INTO users (nombreCompleto, email, contrasena) VALUES (?, ?, ?)";
      db.query(sql, [nombreCompleto, email, hash], (err, result) => {
          if (err) {
              console.error("Error registrando usuario:", err);
              return res.status(500).json({ success: false, error: "Error al registrar usuario" });
          }
          res.status(200).json({ success: true, message: "Registro exitoso" });
      });
  });
});



app.post('/validateCreditCard', (req, res) => {
  const { cardNumber, cardName, expiryDate, cvv } = req.body;

  const sql = `
    SELECT * FROM credit_cards
    WHERE card_number = ? AND card_name = ? AND expiry_date = ? AND cvv = ?
  `;
  const params = [cardNumber, cardName, expiryDate, cvv];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error validating credit card:', err);
      res.status(500).json({ error: 'Error validating credit card' });
    } else if (results.length === 0) {
      res.status(400).json({ error: 'Tarjeta no encontrada. Verifique los datos.' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/checkBalance', (req, res) => {
  const { cardNumber, amount } = req.body;

  const sql = `SELECT balance FROM credit_cards WHERE card_number = ?`;
  const params = [cardNumber];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error checking balance:', err);
      res.status(500).json({ error: 'Error checking balance' });
    } else if (results.length === 0) {
      res.status(400).json({ error: 'Tarjeta no encontrada.' });
    } else {
      const balance = parseFloat(results[0].balance);
      if (balance < amount) {
        res.status(400).json({ error: 'Saldo insuficiente.' });
      } else {
        res.json({ success: true });
      }
    }
  });
});

// Procesar pago
app.post('/processPayment', (req, res) => {
  const { cardNumber, amount } = req.body;

  const sql = `UPDATE credit_cards SET balance = balance - ? WHERE card_number = ?`;
  const params = [amount, cardNumber];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error processing payment:', err);
      res.status(500).json({ error: 'Error processing payment' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/checkout', (req, res) => {
  const { userId, totalAmount } = req.body;

  const sql = 'UPDATE users SET balance = balance - ? WHERE ID = ?';
  db.query(sql, [totalAmount, userId], (err, results) => {
    if (err) {
      console.error('Error updating balance:', err);
      res.status(500).json({ error: 'Error updating balance' });
    } else {
      res.json({ success: true, message: 'Payment successful' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



app.post("/iniciarsesion", (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ success: false, error: "Correo y contraseña requeridos" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ success: false, error: "Error en el servidor" });
        }

        if (result.length === 0) {
            return res.status(401).json({ success: false, error: "Correo o contraseña incorrectos" });
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!password) {
            return res.status(401).json({ success: false, error: "Correo o contraseña incorrectos" });
        }

        res.json({ success: true, message: "Inicio de sesión exitoso" });
    });
});


// para crypto
// Verificar saldo de criptomonedas
app.post("/checkCryptoBalance", (req, res) => {
  const { walletKey } = req.body;

  // Verificar si el walletKey existe en la base de datos
  const sql = "SELECT balance FROM wallets WHERE wallet_key = ?";
  console.log(walletKey);
  db.query(sql, [walletKey], (err, results) => {
    if (err) {
      console.error("Error checking crypto balance:", err);
      res.status(500).json({ error: "Error checking balance" });
    } else if (results.length === 0) {
      res.status(400).json({ error: "Wallet no encontrada." });
    } else {
      res.json({ success: true, balance: results[0].balance }); // Devolver el saldo encontrado
    }
  });
});


app.post("/processCryptoPayment", (req, res) => {
  const { walletKey, amount } = req.body;

  const sql = "UPDATE wallets SET balance = balance - ? WHERE wallet_key = ? ";
  db.query(sql, [amount, walletKey], (err, results) => {
    if (err) {
      console.error("Error processing crypto payment:", err);
      res.status(500).json({ error: "Error processing payment" });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/savePayment', (req, res) => {
    const { user, amount, method, status } = req.body;

    const sql = "INSERT INTO payments (user, amount, method, status, created_at) VALUES (?, ?, ?, ?, NOW())";
    const params = [user, amount, method, status];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error saving payment:", err);
            res.status(500).json({ error: "Error saving payment" });
        } else {
            console.log("Pago guardado con éxito en la BD ;D :", results);
            res.json({ success: true, message: "Pago registrado correctamente" });
        }
    });
});