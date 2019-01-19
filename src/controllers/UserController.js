import bcrypt from 'bcrypt';
import Boom from 'boom';
import User from '../models/User';
import createToken from '../util/token';

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
  const { email, username, password } = req.payload;

  user.email = email;
  user.username = username;
  user.admin = false;

  try {
    user.password = await bcrypt.hash(password, 10);
    const newUser = await user.save();
    return { token: createToken(newUser) };
  } catch (error) {
    throw Boom.internal();
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
      return { token: createToken(user) };
    }
    return Boom.unauthorized('Incorrect password!');
  }
  return Boom.unauthorized('Incorrect username or email!');
};

const verifyToken = async req => req.auth.credentials.decoded;

export {
  login,
  register,
  verifyUniqueUser,
  verifyToken
};
