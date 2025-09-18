import * as dotenv from 'dotenv';
import User from '../../models/User/User';
import Contact from '../../models/Contact/Contact';
import Profile from '../../models/Profile/Profile';
import Address from '../../models/Address/Address';
import Signature from '../../models/Signature/Signature';


dotenv.config();

class UserGoogleController {
  async index(req, res) {
    try {

      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.limit) || 10;
      const offset = (page - 1) * pageSize;

      const { rows: users, count: total } = await User.findAndCountAll({
        attributes: ['id', 'name', 'surname', 'email'],
        include: [
          { model: Contact, as: 'contact', attributes: [ 'telephone', 'smartphone'] },
          { model: Address, as: 'address', attributes: [ 'address_name', 'country', 'state', 'city', 'cep'] },
          { model: Signature, as: 'signature', attributes: [ 'name', 'price', 'discount'] },
          { model: Profile, as: 'profile', attributes: [ 'name'] },
        ],
        limit: pageSize,
        offset: offset,
      });

      const totalUsers = total;

      return res.json({
        totalPages: Math.ceil(totalUsers / pageSize),
        currentPage: page,
        pageSize: pageSize,
        totalUsers,
        users,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  async indexGoogle(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado' });
      }
      const userGoogle = req.user;

      const userExists = await User.findOne({ where: {email: userGoogle.email}});

      return res.json(userGoogle);
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({error: 'Erro ao processar autenticação Google'});
    }
  }
}

export default new UserGoogleController();
