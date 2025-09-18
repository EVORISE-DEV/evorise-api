import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../../config/auth';
import Contact from '../../models/Contact/Contact';
import User from '../../models/User/User';
import Profile from '../../models/Profile/Profile';
import Signature from '../../models/Signature/Signature';
import Address from '../../models/Address/Address';
import { profile } from 'console';

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

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name, surname, profile_id } = user;

    const token = jwt.sign({ id, profile_id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    return res.json({
      message: 'Login realizado com sucesso',
    });
  }

  async getMe(req, res) {

    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'surname', 'email', 'profile_id'],
      include: [
          { model: Contact, as: 'contact', attributes: [ 'telephone', 'smartphone'] },
          { model: Address, as: 'address', attributes: [ 'address_name', 'country', 'state', 'city', 'cep'] },
          { model: Signature, as: 'signature', attributes: [ 'name', 'price', 'discount'] },
          { model: Profile, as: 'profile', attributes: [ 'name'] },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  }

  async storeGoogle(req, res) {

    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { name, email } = req.user;
    const randomPassword = crypto.randomBytes(16).toString('hex');

    const [user, created] = await User.findOrCreate({ // created is boolean
      include: [
          { model: Contact, as: 'contact', attributes: [ 'telephone', 'smartphone'] },
          { model: Address, as: 'address', attributes: [ 'address_name', 'country', 'state', 'city', 'cep'] },
          { model: Signature, as: 'signature', attributes: [ 'name', 'price', 'discount'] },
          { model: Profile, as: 'profile', attributes: [ 'name'] },
      ],
      where: { email },
      defaults: {
        name: name,
        surname: '',
        password: randomPassword,
        profile_id: 1,
        signature_id: 1,
      },
    });

    const { id, profile_id } = user;
    const token = jwt.sign({ id, profile_id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });

    if(user && !created) {
      const result = user;
      return res.status(201).json({
        message: 'Usuário logado com sucesso',
        result: {
          name: result.name,
          surname: result.surname,
          signature: result.signature.name,
          profile: result.profile.name
        }
      });
    }
    if(created) {
      const result = created;
      await res.status(201).json({
        message: 'Usuário criado com sucesso',
        result: {
          name: result.name,
          surname: result.surname,
        }
      });
    }
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

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return res.json({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
  }
}

export default new SessionController();
