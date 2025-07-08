import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';
import passport from 'passport';
const crypto = require('crypto');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name, surname, profile_id } = user;

    const token = jwt.sign({ id, profile_id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({
      user: { id, name, surname, email, profile_id },
      token,
    });
  }

  async storeGoogle(req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { name, email } = req.user;
    const randomPassword = crypto.randomBytes(16).toString('hex');

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: name,
        surname: '',
        password: randomPassword,
        profile_id: 1,
        signature_id: 1,
      },
    });

    const { id, surname, profile_id } = user;
    const token = jwt.sign({ id, profile_id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({
      user: { id, name, surname, email, profile_id },
      token,
      created, // opcional: para saber se foi criado agora
    });
  }


  async validateSession(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, authConfig.secret);

      req.userId = decoded.id;
      req.profileId = decoded.profile_id;

      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  }

  async logout(req, res) {
    try {
      // No logout, o cliente deve deletar o token do localStorage/sessionStorage/cookies
      return res.json({ message: 'Logout realizado com sucesso. Remova o token no cliente.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
  }
}

export default new SessionController();
