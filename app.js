const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const { secret } = require('./crypto/config');
const userRoutes = require('./routes/users');

const app = express();

console.log("Secreto para sesiones:", secret);

// Configuración de sesión
app.use(session({
  secret:'clave_muy_segura_123!',
  resave: false,
  saveUninitialized: true
}));

// Middlewares necesarios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', userRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
