const { validationResult } = require('express-validator');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'AuthError: Failed Auth' });
  }
  const email = req.body.email;
  const password = req.body.password;
  const user = new User();
  user.setEmail(email);
  user.setPassword(password);
  const authenticatedUser = await user.authenticate();
  if (authenticatedUser == 'Failed Auth')
    return res.status(422).json({ message: 'AuthError: Failed Auth' });
  if (authenticatedUser == 'Fail')
    return res.status(500).json({ message: 'AuthError: Fail' });
  const token = jwt.sign(authenticatedUser, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
  res.cookie('auth', token, {
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
    domain: process.env.DOMAIN,
    maxAge: 3555 * 1000,
  });
  return res.status(200).json({ message: 'Success' });
};
