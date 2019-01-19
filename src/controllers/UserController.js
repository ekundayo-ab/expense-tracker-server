import bcrypt from 'bcrypt';
import Boom from 'boom';
import User from '../models/User';
import createToken from '../util/token';

const checkUserExistence = async (req) => {
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
  if (req.pre.user) {
    return Boom.conflict('User already exists');
  }

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
  const { user } = req.pre;
  const { password } = req.payload;

  const isValid = user && await bcrypt.compare(password, user.password);

  if (!user || !isValid) {
    return Boom.unauthorized('Incorrect credentials!');
  }

  return { token: createToken(user) };
};

const verifyToken = async req => req.auth.credentials.decoded;

export {
  login,
  register,
  checkUserExistence,
  verifyToken
};
