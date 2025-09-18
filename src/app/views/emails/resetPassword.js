import { resetUrl } from '../../services/ResetPasswordService';
const logoUrl = '../../../../upload/evorise/group-1.png';

const html = `
  <div style="background-color:#08142D;padding:40px 0;min-height:100vh;">
    <div style="background:#fff;border-radius:12px;max-width:420px;margin:0 auto;padding:36px 32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);font-family:sans-serif;">
      <div style="text-align:center;margin-bottom:24px;">
        <img src="${logoUrl}" alt="EVORISE" style="height:52px;margin-bottom:8px;" />
        <h2 style="color:#08142D;font-weight:700;font-size:1.6em;margin:0;">Redefinição de Senha</h2>
      </div>
      <p style="color:#08142D;font-size:1em;margin-bottom:24px;">
        Olá! Recebemos uma solicitação para redefinir sua senha na plataforma <span style="color:#1882B6;font-weight:700;">EVORISE</span>.
      </p>
      <a href="${resetUrl}"
         style="display:inline-block;padding:12px 28px;background:#1882B6;color:#fff;border-radius:8px;font-weight:bold;text-decoration:none;margin-bottom:18px;transition:background .2s">
         Redefinir Senha
      </a>
      <p style="color:#000;font-size:.95em;margin-top:28px;">
        Ou, se preferir, copie e cole este link no seu navegador:<br/>
        <span style="color:#1882B6;word-break:break-all;">${resetUrl}</span>
      </p>
      <hr style="margin:32px 0 12px 0;border:0;border-top:1px solid #eee;">
      <p style="color:#666;font-size:.92em;">
        Se você não solicitou essa alteração, pode ignorar este e-mail com segurança.<br>
        Dúvidas? Fale com o suporte do <b>EVORISE</b>.
      </p>
    </div>
    <div style="text-align:center;color:#888;margin-top:20px;font-size:.89em;">
      &copy; ${new Date().getFullYear()} EVORISE
    </div>
  </div>
`;
export default html;
