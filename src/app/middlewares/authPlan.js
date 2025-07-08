import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import User from '../models/User'; // Importe o modelo User

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não existe.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // Verifica o token JWT
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;


    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }


    if (user.profile_id === 4 || user.profile_id === 2 ) {
      return next();
    } else {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para acessar esta rota.' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
