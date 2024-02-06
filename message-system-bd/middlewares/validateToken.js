require('dotenv').config();

const jwt = require('jsonwebtoken');

function validateToken(req, res) {
    let token;
    if(req.authorization){
      token = req.authorization.split(' ')[1];;
    }else if(req.headers['authorization']){
      token = req.headers['authorization'].split(' ')[1];

      if (!token) {
        return res.status(401).json({ err: 'Undefined token' });
      }
    }else if (req.cookies){
      token = req.cookies.Authorization;
      console.log(token)
    }else{
      return res.status(403).json({ err: 'Auth null' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if(req.authorization){
        if (err) {
          return new Error("Error")
        }
        req.user = decoded;
      }else{
        if (err) {
          return res.status(403).json({ err: 'Invalid token' });
        }
        req.user = decoded;
      }
    });
}

function validateTokenMW(req, res, next){
  validateToken(req, res);
  next();
}

module.exports = {validateToken, validateTokenMW}