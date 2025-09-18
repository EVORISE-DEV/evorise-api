import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import User from '../models/User/User'; // Importe o modelo User

export default async (req, res, next) => {
  let token;

  // 1. Primeiro tenta no header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    [, token] = authHeader.split(' ');
  }

  if (!token && req.cookies && req.cookies.refreshToken) {
    token = req.cookies.refreshToken;
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (user.profile_id === 2 ) {
      return next();
    } else {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para acessar esta rota.' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Token invalido.' });
  }
};
