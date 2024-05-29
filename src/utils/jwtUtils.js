const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

const generateToken = (userId, role) => {
  const payload = { userId, role };
  const options = { expiresIn: config.jwt.expiresIn };
  return jwt.sign(payload, config.jwt.secret, options);
};

module.exports = { generateToken };