'use strict';

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('products', [

      // ✅ 1. Tênis de Corrida
      { name: 'Nike Pro', description: 'Tênis confortável e ótimo para corridas intensas.', price: 309.99, discount: 10.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Adidas UltraBoost', description: 'Modelo com amortecimento aprimorado.', price: 499.99, discount: 15.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Asics Gel-Nimbus', description: 'Suporte e estabilidade para longas distâncias.', price: 399.99, discount: 20.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Mizuno Wave Rider', description: 'Leve e responsivo.', price: 429.99, discount: 12.00, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { name: 'Puma Velocity Nitro', description: 'Tecnologia avançada para máximo desempenho.', price: 379.99, discount: 18.00, category_id: 1, created_at: new Date(), updated_at: new Date() },

      // ✅ 2. Camisetas
      { name: 'Nike Dri-Fit', description: 'Tecido respirável.', price: 119.99, discount: 5.00, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { name: 'Adidas Climalite', description: 'Material leve e confortável.', price: 99.99, discount: 8.00, category_id: 2, created_at: new Date(), updated_at: new Date() },

      // ✅ 3. Shorts
      { name: 'Nike Flex Stride', description: 'Shorts leve para corrida.', price: 129.99, discount: 10.00, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { name: 'Adidas Running Shorts', description: 'Ideal para corridas longas.', price: 109.99, discount: 7.00, category_id: 3, created_at: new Date(), updated_at: new Date() },

      // ✅ 4. Meias de Compressão
      { name: 'Nike Elite Running', description: 'Suporte para melhor circulação.', price: 49.99, discount: 5.00, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { name: 'Adidas Run X', description: 'Meias de compressão para máximo conforto.', price: 59.99, discount: 8.00, category_id: 4, created_at: new Date(), updated_at: new Date() },

      // ✅ 5. Relógios Esportivos
      { name: 'Garmin Forerunner 945', description: 'Monitoramento completo para atletas.', price: 2899.99, discount: 50.00, category_id: 5, created_at: new Date(), updated_at: new Date() },
      { name: 'Suunto 9 Baro', description: 'GPS de alta precisão.', price: 2499.99, discount: 45.00, category_id: 5, created_at: new Date(), updated_at: new Date() },

      // ✅ 6. Bonés e Viseiras
      { name: 'Nike AeroBill Cap', description: 'Boné respirável.', price: 79.99, discount: 5.00, category_id: 6, created_at: new Date(), updated_at: new Date() },
      { name: 'Adidas Climalite Visor', description: 'Viseira leve para proteção solar.', price: 69.99, discount: 5.00, category_id: 6, created_at: new Date(), updated_at: new Date() },

      // ✅ 7. Óculos de Proteção UV
      { name: 'Oakley Radar EV', description: 'Proteção contra raios UV.', price: 499.99, discount: 20.00, category_id: 7, created_at: new Date(), updated_at: new Date() },
      { name: 'Nike Tailwind', description: 'Óculos de corrida ultraleve.', price: 429.99, discount: 18.00, category_id: 7, created_at: new Date(), updated_at: new Date() },

      // ✅ 8. Fones de Ouvido para Corrida
      { name: 'JBL Endurance Sprint', description: 'Fone resistente ao suor.', price: 199.99, discount: 10.00, category_id: 8, created_at: new Date(), updated_at: new Date() },
      { name: 'Aftershokz Aeropex', description: 'Tecnologia de condução óssea.', price: 599.99, discount: 25.00, category_id: 8, created_at: new Date(), updated_at: new Date() },

      // ✅ 9. Garrafas e Cintos de Hidratação
      { name: 'Hydro Flask 21oz', description: 'Garrafa térmica para hidratação.', price: 159.99, discount: 10.00, category_id: 9, created_at: new Date(), updated_at: new Date() },
      { name: 'Salomon Hydration Belt', description: 'Cinto com suporte para garrafa.', price: 189.99, discount: 12.00, category_id: 9, created_at: new Date(), updated_at: new Date() },

      // ✅ 10. Kits de Recuperação e Suplementos
      { name: 'Theragun Mini', description: 'Dispositivo para massagem muscular.', price: 849.99, discount: 40.00, category_id: 10, created_at: new Date(), updated_at: new Date() },
      { name: 'GU Energy Gel', description: 'Pacote de 12 géis energéticos.', price: 99.99, discount: 5.00, category_id: 10, created_at: new Date(), updated_at: new Date() },

    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('products', null, {});
  },
};
