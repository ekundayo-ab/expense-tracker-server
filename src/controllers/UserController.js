const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../models/User');
const createToken = require('../util/token');

const verifyUniqueUser = async (req) => {
  try {
    const result = await User.findOne({
      $or: [
        { email: req.payload.email },
        { username: req.payload.username }
      ]
    });
    return result;
  } catch (error) {
    throw Boom.badRequest(error);
  }
};

const register = async (req) => {
  const user = new User();
  user.email = req.payload.email;
  user.username = req.payload.username;
  user.admin = false;

  try {
    user.password = await bcrypt.hash(req.payload.password, 10);
  } catch (error) {
    throw Boom.badRequest(error);
  }

  try {
    const newUser = await user.save();
    return { token: createToken(newUser) };
  } catch (error) {
    throw Boom.badRequest(error);
  }
};

const login = async (req) => {
  const { password } = req.payload;

  const user = await User.findOne({
    $or: [
      { email: req.payload.email },
      { username: req.payload.username }
    ]
  });

  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    }
    return Boom.badRequest('Incorrect password!');
  }
  return Boom.badRequest('Incorrect username or email!');
};

module.exports = {
  login,
  register,
  verifyUniqueUser
};
