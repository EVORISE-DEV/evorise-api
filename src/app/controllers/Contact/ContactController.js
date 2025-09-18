import * as Yup from 'yup';
import Contact from '../../models/Contact/Contact';

class ContactController {
  async index(req, res) {
    try {
      const contacts = await Contact.findAll({
        attributes: ['id', 'telephone', 'smartphone'],
      });

      return res.json(contacts);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar contatos.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      telephone: Yup.string().nullable(),
      smartphone: Yup.string().required('O número de smartphone é obrigatório'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const contact = await Contact.create(req.body);

    return res.json(contact);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      telephone: Yup.string().nullable(),
      smartphone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }

    await contact.update(req.body);

    return res.json(contact);
  }

  async delete(req, res) {
    try {
      const contact = await Contact.findByPk(req.params.id);

      if (!contact) {
        return res.status(404).json({ error: 'Contato não encontrado' });
      }

      await contact.destroy();

      return res.status(200).json({ message: 'Contato deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar contato' });
    }
  }
}

export default new ContactController();
