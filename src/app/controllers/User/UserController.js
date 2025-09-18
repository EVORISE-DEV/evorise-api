import * as Yup from 'yup';
import User from '../../models/User/User';
import Contact from '../../models/Contact/Contact';
import Address from '../../models/Address/Address';
import Signature from '../../models/Signature/Signature';
import Profile from '../../models/Profile/Profile';
import Contact from '../../models/Contact/Contact';
import sequelize from '../../../config/sequelize';
import * as dotenv from 'dotenv';
import buildUserFilter from '../../services/filter/userFiltter';

dotenv.config();

class UserController {
  async index(req, res) {
    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const where = buildUserFilter(req.query || {});

      const { rows: users, count: total } = await User.findAndCountAll({
        attributes: ['id', 'name', 'surname', 'email'],
        include: [
          { model: Contact, as: 'contact', attributes: [ 'telephone', 'smartphone'] },
          { model: Address, as: 'address', attributes: [ 'address_name', 'country', 'state', 'city', 'cep'] },
          { model: Signature, as: 'signature', attributes: [ 'name', 'price', 'discount'] },
          { model: Profile, as: 'profile', attributes: [ 'name'] },
        ],
        order: [
          ['name', 'ASC']
        ],
        where,
        distinct: true,
        subQuery: false,
        limit,
        offset
      });

      return res.json({
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
        users,
      });

    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        surname: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
        confirmPassword: Yup.string()
          .required()
          .oneOf([Yup.ref('password')], 'As senhas não coincidem'),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validação falhou' });
      }

      const userExists = await User.findOne({ where: { email: req.body.email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      const user = await User.create({
        ...req.body,
        profile_id: 1,
        signature_id: 1
      });


      const createdUser = await User.findByPk(user.id, {
        include: [
          { model: Contact, as: 'contact', attributes: [ 'telephone', 'smartphone'] },
          { model: Address, as: 'address', attributes: [ 'address_name', 'country', 'state', 'city', 'cep'] },
          { model: Signature, as: 'signature', attributes: [ 'name', 'price', 'discount'] },
          { model: Profile, as: 'profile', attributes: [ 'name'] },
        ]
      });

      return res.json({
        id: createdUser.id,
        name: createdUser.name,
        surname: createdUser.surname,
        email: createdUser.email,
        profile: createdUser.profile,
        address: createdUser.address,
        contact: createdUser.contact,
        signature: createdUser.signature,
      });

    }
    catch(err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }

  }


  async updateData(req, res){
    const {
      name, surname, email, oldPassword,
      password, confirmPassword,contact,
      address, signature, profile
    } = req.body;

    try {

      const userExists = await User.findByPk(req.userId, {
        include: [
          { model: Contact, as: 'contact', attributes: [ 'telephone', 'smartphone'] },
          { model: Address, as: 'address', attributes: [ 'address_name', 'country', 'state', 'city', 'cep'] },
          { model: Signature, as: 'signature', attributes: [ 'name', 'price', 'discount'] },
          { model: Profile, as: 'profile', attributes: [ 'name'] },
        ]
      });

      if (!userExists) {
        return res.status(404).json({ message: 'user não encontrado.' });
      }

      if (email && email !== userExists.email) {
        const userEmail = await User.findOne({ where: { email } });
        if (userEmail) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
      }

      if (oldPassword) {
        if (!password) {
          return res.status(400).json({ error: 'Nova senha é obrigatória quando a senha antiga é informada' });
        }
        if (password.length < 6) {
          return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' });
        }
        if (!confirmPassword) {
          return res.status(400).json({ error: 'Confirmação de senha é obrigatória' });
        }
        if (password !== confirmPassword) {
          return res.status(400).json({ error: 'A confirmação da senha não confere' });
        }
        if (!(await userExists.checkPassword(oldPassword))) {
          return res.status(401).json({ error: 'Senha antiga incorreta' });
        }
      }

      const userUpdate = {
        ...(name && { name }),
        ...(surname && { surname }),
        ...(email && { email }),
        ...(oldPassword && { password }),
      };

      await userExists.update(userUpdate);

      if (contact) {
        if (userExists.contact) {
          await userExists.contact.update(contact);
        } else {
          await userExists.createContact(contact);
        }
      }

      if (address) {
        if (userExists.address) {
          await userExists.address.update(address);
        } else {
          await userExists.createAddress(address);
        }
      }

      if (signature) {
        if (userExists.signature) {
          await userExists.signature.update(signature);
        } else {
          await userExists.createSignature(signature);
        }
      }

      if (profile) {
        if (userExists.profile) {
          await userExists.profile.update(profile);
        } else {
          await userExists.createProfile(profile);
        }
      }

      return res.json({
        id: userExists.id,
        name: userExists.name,
        surname: userExists.surname,
        email: userExists.email,
        profile: userExists.profile,
        address: userExists.address,
        contact: userExists.contact,
        signature: userExists.signature,
    });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar user.' });
    }

  }

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
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

      return res.json({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profile: user.profile,
        address: user.address,
        contact: user.contact,
        signature: user.signature,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async deleteTransaction(req, res) {
    const t = await sequelize.transaction();

    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { association: 'address' },
          { association: 'contact' },
          { association: 'signature' },
          { association: 'profile' },
        ],
        transaction: t,
      });

      if(!user) return res.status(404).json({error: 'Usuário não encontrado'});

      if(user.address) {await user.address.destroy({transaction: t});}

      if(user.contact) {await user.contact.destroy({transaction: t});}

      if(user.signature) {await user.signature.destroy({transaction: t});}

      if(user.profile) {await user.profile.destroy({transaction: t});}

      await user.destroy({ transaction: t });

      await t.commit();

    return res.status(200).json({ message: 'Usuário e suas associações deletados com sucesso.' });
    }
    catch (error) {
      await t.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
}

export default new UserController();
