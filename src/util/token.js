import jwt from 'jsonwebtoken';
import secret from '../../config';

const createToken = (user) => {
  let scopes;

  if (user.admin) {
    scopes = 'admin';
  }

  return jwt.sign({
    id: user._id,
    username: user.username,
    scope: scopes
  }, secret, { algorithm: 'HS256', expiresIn: '1h' });
};

export default createToken;
