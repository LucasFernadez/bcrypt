const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../data/users'); // Importamos el array directamente
console.log("¿Qué es users?:", users);
console.log("¿Es un array?", Array.isArray(users));

const { generateToken } = require('../middlewares/authMiddleware');
const { secret } = require('../crypto/config');

// Página de inicio: muestra login si no está logueado, o link al dashboard si sí
router.get('/', (req, res) => {
  if (req.session.token) {
    res.send(`
      <h2>Bienvenido de nuevo</h2>
      <a href="/dashboard">Ir al Panel</a>
      <form action="/logout" method="POST">
        <button type="submit">Cerrar sesión</button>
      </form>
    `);
  } else {
    res.send(`
      <h2>Iniciar Sesión</h2>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Usuario" required />
        <input type="password" name="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
    `);
  }
});

// Endpoint de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Buscamos al usuario
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).send('Credenciales incorrectas. <a href="/">Volver</a>');
  }

  // Generamos el token
  const token = generateToken(user);

  // Guardamos el token en sesión
  req.session.token = token;

  res.redirect('/dashboard');
});

// Dashboard (requiere token válido)
router.get('/dashboard', (req, res) => {
  if (!req.session.token) {
    return res.status(401).send('Acceso no autorizado. <a href="/">Inicia sesión</a>');
  }

  // Verificamos el token
  jwt.verify(req.session.token, secret, (err, user) => {
    if (err) {
      return res.status(403).send('Token inválido o expirado. <a href="/">Volver</a>');
    }

    res.send(`
      <h1>Bienvenido, ${user.name}</h1>
      <p>Este es el panel privado</p>
      <form action="/logout" method="POST">
        <button type="submit">Cerrar sesión</button>
      </form>
    `);
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error al cerrar sesión.');
    res.redirect('/');
  });
});

module.exports = router;

