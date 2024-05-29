const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwtUtils');
const { User } = require('../models/userModel');
const { ErrorResponse } = require('../utils/errorUtils');

exports.register = async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorResponse('Email already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, email });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorResponse('Invalid email or password', 400));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ErrorResponse('Invalid email or password', 400));
    }

    const token = generateToken(user.id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};