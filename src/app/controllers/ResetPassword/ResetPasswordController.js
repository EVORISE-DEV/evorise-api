import crypto from 'crypto';
import User from '../../models/User/User';
import ResetPasswordService from '../../services/ResetPasswordService';
import { Op } from 'sequelize';

const TOKEN_EXPIRATION = 60 * 60 * 1000; // 1 hora em ms

class ResetPasswordController {

  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION);

    await user.update({
      reset_password_token: resetToken,
      reset_password_expires: resetTokenExpires
    });

    await ResetPasswordService.sendResetEmail(email, resetToken);

    return res.status(200).json({ message: 'Se o e-mail existir, você receberá as instruções.' });
  }

  async update(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    console.log('teste:', token, password);

    if (!token) return res.status(400).json({ error: 'Token é obrigatório.' });
    if (!password) return res.status(400).json({ error: 'Senha é obrigatória.' });

    const user = await User.findOne({
      where: {
        reset_password_token: token,
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    user.password = password;

    user.reset_password_token = null;
    user.reset_password_expires = null;

    await user.save();

    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  }
}

export default new ResetPasswordController();
