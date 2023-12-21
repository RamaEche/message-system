require('dotenv').config();

const jwt = require('jsonwebtoken');

function createToken(usuario) {
    const token = jwt.sign(usuario, process.env.JWT_SECRET_KEY);
    return token;
}

module.exports = createToken