const jwt = require('jsonwebtoken');
const { secret } = require('../crypto/config');

// Función que genera un token JWT con la info del usuario
function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name }, // Puedes añadir más info aquí si quieres
    secret,
    { expiresIn: '1h' } // Token válido por 1 hora
  );
}

// Middleware para proteger rutas (verifica el token)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

  if (!token) {
    return res.status(401).send('Acceso denegado. Token no proporcionado.');
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).send('Token inválido o expirado.');
    }

    req.user = user;
    next();
  });
}

// Exportamos ambas funciones
module.exports = {
  generateToken,
  authenticateToken
};
