// PointsController.js
import client from '../../config/redisClient';

class PointsController {
  // Adiciona pontos ao usuário
  async addPoints(req, res) {
    try {
      const userId = req.userId; // Supondo que o middleware já defina req.userId
      const { points } = req.body; // Pontos a serem adicionados

      // Converte o valor de points para um número (float, caso queira aceitar decimais)
      const increment = parseFloat(points);
      if (Number.isNaN(increment)) {
        return res.status(400).json({ error: 'Valor de pontos inválido. Envie um número.' });
      }

      // Incrementa os pontos do usuário no ZSET 'user_points'
      await client.zIncrBy('user_points', increment, userId.toString());

      // Recupera a nova pontuação do usuário
      const newPoints = await client.zScore('user_points', userId.toString());
      console.log(newPoints);
      return res.json({ message: 'Pontos adicionados com sucesso', points: newPoints });
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      return res.status(500).json({ error: 'Erro ao adicionar pontos.' });
    }
  }

  // Obtém os usuários que possuem pontos (score >= 1)
  async getRanking(req, res) {
    try {
      // Busca os membros com score >= 1, retornando um array intercalado
      const rawRanking = await client.zRangeByScore('user_points', 1, '+inf', { WITHSCORES: true });

      // Transforma o array intercalado em um array de objetos
      const ranking = [];
      for (let i = 0; i < rawRanking.length; i += 2) {
        ranking.push({
          user: rawRanking[i],
          score: Number(rawRanking[i + 1]),
        });
      }
      console.log('Ranking retornado:', ranking);
      return res.json({ ranking });
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      return res.status(500).json({ error: 'Erro ao buscar ranking.' });
    }
  }
}

export default new PointsController();
