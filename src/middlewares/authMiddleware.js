const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { ErrorResponse } = require('../utils/errorUtils');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ErrorResponse('Authorization header is missing', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    next(new ErrorResponse('Invalid token', 401));
  }
};