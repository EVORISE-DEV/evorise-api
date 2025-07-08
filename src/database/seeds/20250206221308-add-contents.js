'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('contents', [

      // ✅ 1. Técnicas de Corrida
      { title: 'Postura Correta na Corrida', description: 'Melhore sua postura para evitar lesões.', price: 59.99, discount: 5.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { title: 'Respiração Eficiente', description: 'Aprenda técnicas de respiração para resistência.', price: 49.99, discount: 5.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { title: 'Passadas e Ritmo', description: 'Otimize sua passada para melhor performance.', price: 69.99, discount: 7.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { title: 'Corrida em Diferentes Terrenos', description: 'Adapte sua corrida a qualquer superfície.', price: 79.99, discount: 10.00, category_id: 1, created_at: new Date(), updated_at: new Date() },

      // ✅ 2. Aquecimento e Alongamento
      { title: 'Alongamento Dinâmico', description: 'Prepare seu corpo para corridas intensas.', price: 39.99, discount: 5.00, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { title: 'Rotina de Aquecimento', description: 'Evite lesões com exercícios eficazes.', price: 49.99, discount: 5.00, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { title: 'Mobilidade para Corredores', description: 'Aumente sua flexibilidade e amplitude.', price: 69.99, discount: 8.00, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { title: 'Alongamento Pós-Corrida', description: 'Técnicas para acelerar a recuperação.', price: 79.99, discount: 10.00, category_id: 2, created_at: new Date(), updated_at: new Date() },

      // ✅ 3. Nutrição e Hidratação
      { title: 'Dieta para Corredores', description: 'Alimente-se corretamente para máximo desempenho.', price: 89.99, discount: 10.00, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { title: 'Hidratação Antes da Corrida', description: 'Mantenha-se hidratado para evitar fadiga.', price: 79.99, discount: 8.00, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { title: 'Refeições Pós-Treino', description: 'Melhore sua recuperação com alimentação adequada.', price: 99.99, discount: 10.00, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { title: 'Suplementação para Corredores', description: 'Conheça os suplementos ideais.', price: 119.99, discount: 12.00, category_id: 3, created_at: new Date(), updated_at: new Date() },

      // ✅ 4. Prevenção de Lesões
      { title: 'Fortalecimento Muscular', description: 'Evite lesões fortalecendo os músculos corretos.', price: 89.99, discount: 10.00, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { title: 'Técnicas de Recuperação', description: 'Métodos para acelerar sua recuperação.', price: 99.99, discount: 12.00, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { title: 'Uso de Fitas Kinesiológicas', description: 'Ajuda na prevenção e tratamento de lesões.', price: 79.99, discount: 10.00, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { title: 'Pisos e Lesões', description: 'Como evitar lesões dependendo do terreno.', price: 69.99, discount: 8.00, category_id: 4, created_at: new Date(), updated_at: new Date() },

      // ✅ 5. Planos de Treinamento
      { title: 'Planos para Iniciantes', description: 'Comece sua jornada na corrida.', price: 59.99, discount: 7.00, category_id: 5, created_at: new Date(), updated_at: new Date() },
      { title: 'Treinos para Meia-Maratona', description: 'Preparação para provas longas.', price: 89.99, discount: 10.00, category_id: 5, created_at: new Date(), updated_at: new Date() },
      { title: 'Treinamento para Maratonas', description: 'Dicas para corridas acima de 42km.', price: 119.99, discount: 12.00, category_id: 5, created_at: new Date(), updated_at: new Date() },
      { title: 'Treinos Intervalados', description: 'Método eficaz para ganho de velocidade.', price: 99.99, discount: 10.00, category_id: 5, created_at: new Date(), updated_at: new Date() },

      // ✅ 6. Equipamentos e Acessórios
      { title: 'Tênis Ideais para Corrida', description: 'Saiba escolher o melhor modelo.', price: 129.99, discount: 15.00, category_id: 6, created_at: new Date(), updated_at: new Date() },
      { title: 'Vestuário para Diferentes Climas', description: 'Roupas adequadas para qualquer estação.', price: 109.99, discount: 12.00, category_id: 6, created_at: new Date(), updated_at: new Date() },
      { title: 'Relógios GPS e Sensores', description: 'Como usar tecnologia para melhorar seu treino.', price: 159.99, discount: 18.00, category_id: 6, created_at: new Date(), updated_at: new Date() },
      { title: 'Hidratação e Cintos de Corrida', description: 'Dicas para manter-se hidratado.', price: 89.99, discount: 10.00, category_id: 6, created_at: new Date(), updated_at: new Date() },

      // Continue com as categorias 7, 8, 9 e 10 seguindo esse padrão...
      // ✅ 7. Psicologia Esportiva
      { title: 'Mentalidade de Campeão', description: 'Desenvolva a mentalidade para alcançar seus objetivos.', price: 79.99, discount: 10.00, category_id: 7, created_at: new Date(), updated_at: new Date() },
      { title: 'Lidando com o Cansaço Mental', description: 'Estratégias para superar momentos difíceis na corrida.', price: 69.99, discount: 8.00, category_id: 7, created_at: new Date(), updated_at: new Date() },
      { title: 'Técnicas de Motivação para Corredores', description: 'Dicas para manter a motivação e disciplina.', price: 89.99, discount: 12.00, category_id: 7, created_at: new Date(), updated_at: new Date() },
      { title: 'Como Superar o Medo de Competições', description: 'Táticas para enfrentar ansiedade pré-prova.', price: 99.99, discount: 15.00, category_id: 7, created_at: new Date(), updated_at: new Date() },

      // ✅ 8. Biomecânica da Corrida
      { title: 'Análise do Movimento do Corredor', description: 'Como identificar erros e melhorar sua eficiência.', price: 119.99, discount: 18.00, category_id: 8, created_at: new Date(), updated_at: new Date() },
      { title: 'Redução de Impacto nas Articulações', description: 'Dicas para evitar desgaste excessivo.', price: 109.99, discount: 12.00, category_id: 8, created_at: new Date(), updated_at: new Date() },
      { title: 'Correção da Postura ao Correr', description: 'Adapte sua postura para mais eficiência.', price: 129.99, discount: 20.00, category_id: 8, created_at: new Date(), updated_at: new Date() },
      { title: 'Treinamento de Cadência e Passada', description: 'Aprenda a otimizar a frequência de passos.', price: 99.99, discount: 10.00, category_id: 8, created_at: new Date(), updated_at: new Date() },

      // ✅ 9. Condicionamento Físico
      { title: 'Treino de Resistência para Corredores', description: 'Melhore sua resistência cardiovascular.', price: 79.99, discount: 10.00, category_id: 9, created_at: new Date(), updated_at: new Date() },
      { title: 'Força e Estabilidade', description: 'Treinos para fortalecer músculos essenciais.', price: 89.99, discount: 12.00, category_id: 9, created_at: new Date(), updated_at: new Date() },
      { title: 'Treinos de Alta Intensidade', description: 'Ganhe velocidade e resistência com HIIT.', price: 99.99, discount: 15.00, category_id: 9, created_at: new Date(), updated_at: new Date() },
      { title: 'Flexibilidade e Mobilidade', description: 'Evite lesões e melhore o desempenho.', price: 69.99, discount: 8.00, category_id: 9, created_at: new Date(), updated_at: new Date() },

      // ✅ 10. Corrida de Rua e Trilhas
      { title: 'Treinamento para Corridas de Rua', description: 'Dicas para competir e melhorar tempos.', price: 79.99, discount: 10.00, category_id: 10, created_at: new Date(), updated_at: new Date() },
      { title: 'Como Correr em Trilhas', description: 'Técnicas para se adaptar a terrenos irregulares.', price: 89.99, discount: 12.00, category_id: 10, created_at: new Date(), updated_at: new Date() },
      { title: 'Preparação para Ultramaratonas', description: 'Planejamento para provas extremas.', price: 129.99, discount: 20.00, category_id: 10, created_at: new Date(), updated_at: new Date() },
      { title: 'Dicas de Segurança para Trilhas', description: 'Evite riscos e mantenha-se seguro.', price: 99.99, discount: 15.00, category_id: 10, created_at: new Date(), updated_at: new Date() },


    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('contents', null, {});
  },
};
