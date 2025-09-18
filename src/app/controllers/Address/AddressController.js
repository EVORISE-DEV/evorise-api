import * as Yup from 'yup';
import Address from '../../models/Address/Address';

class AddressController {
  async index(req, res) {
    try {
      const addresses = await Address.findAll({
        attributes: ['id', 'address_name', 'country', 'state', 'city', 'cep'],
      });

      return res.json(addresses);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar endereços.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      address_name: Yup.string().required('O endereço é obrigatório'),
      country: Yup.string().required('O país é obrigatório'),
      state: Yup.string().required('O estado é obrigatório'),
      city: Yup.string().required('A cidade é obrigatória'),
      cep: Yup.string().required('O CEP é obrigatório'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const address = await Address.create(req.body);
    return res.json(address);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      address_name: Yup.string(),
      country: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const address = await Address.findByPk(req.params.id);

    if (!address) {
      return res.status(404).json({ error: 'Endereço não encontrado' });
    }

    await address.update(req.body);
    return res.json(address);
  }

  async delete(req, res) {
    try {
      const address = await Address.findByPk(req.params.id);

      if (!address) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      await address.destroy();
      return res.status(200).json({ message: 'Endereço removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover endereço' });
    }
  }
}

export default new AddressController();
