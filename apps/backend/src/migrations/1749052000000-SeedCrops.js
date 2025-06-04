class SeedCrops1749052000000 {
  name = 'SeedCrops1749052000000';

  async up(queryRunner) {
    // Inserir culturas pré-cadastradas para facilitar testes
    await queryRunner.query(`
      INSERT INTO crop (id, name, description) VALUES 
      (uuid_generate_v4(), 'Soja', 'Soja (Glycine max) - Leguminosa rica em proteínas'),
      (uuid_generate_v4(), 'Milho', 'Milho (Zea mays) - Cereal base da alimentação'),
      (uuid_generate_v4(), 'Café', 'Café (Coffea) - Grão para bebida estimulante'),
      (uuid_generate_v4(), 'Cana-de-açúcar', 'Cana-de-açúcar (Saccharum officinarum) - Para produção de açúcar e etanol'),
      (uuid_generate_v4(), 'Algodão', 'Algodão (Gossypium) - Fibra têxtil'),
      (uuid_generate_v4(), 'Feijão', 'Feijão (Phaseolus vulgaris) - Leguminosa nutritiva'),
      (uuid_generate_v4(), 'Arroz', 'Arroz (Oryza sativa) - Cereal base da alimentação'),
      (uuid_generate_v4(), 'Trigo', 'Trigo (Triticum) - Cereal para panificação'),
      (uuid_generate_v4(), 'Sorgo', 'Sorgo (Sorghum bicolor) - Cereal resistente à seca'),
      (uuid_generate_v4(), 'Girassol', 'Girassol (Helianthus annuus) - Oleaginosa para óleo')
      ON CONFLICT (name) DO NOTHING;
    `);
  }

  async down(queryRunner) {
    // Remover apenas as culturas que foram inseridas por este seed
    await queryRunner.query(`
      DELETE FROM crop WHERE name IN (
        'Soja', 'Milho', 'Café', 'Cana-de-açúcar', 'Algodão', 
        'Feijão', 'Arroz', 'Trigo', 'Sorgo', 'Girassol'
      );
    `);
  }
}

module.exports = { SeedCrops1749052000000 }; 