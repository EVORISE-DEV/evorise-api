import * as Yup from 'yup';
import Signature from '../models/Signature';

class SignatureController {
  async index(req, res) {
    try {
      const signatures = await Signature.findAll({
        attributes: ['id', 'name', 'price', 'discount'],
      });

      return res.json(signatures);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar assinaturas.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome é obrigatório'),
      price: Yup.number().required('O preço é obrigatório'),
      discount: Yup.number().default(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const signature = await Signature.create(req.body);
    return res.json(signature);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      discount: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const signature = await Signature.findByPk(req.params.id);

    if (!signature) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    await signature.update(req.body);
    return res.json(signature);
  }

  async delete(req, res) {
    try {
      const signature = await Signature.findByPk(req.params.id);

      if (!signature) {
        return res.status(404).json({ error: 'Assinatura não encontrada' });
      }

      await signature.destroy();
      return res.status(200).json({ message: 'Assinatura removida com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover assinatura' });
    }
  }
}

export default new SignatureController();
