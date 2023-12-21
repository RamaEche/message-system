require('dotenv').config();

const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({ err: 'Undefined token' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ err: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
}

module.exports = validateToken