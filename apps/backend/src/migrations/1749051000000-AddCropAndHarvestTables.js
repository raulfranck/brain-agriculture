const { Table, TableForeignKey, TableIndex } = require('typeorm');

class AddCropAndHarvestTables1749051000000 {
  name = 'AddCropAndHarvestTables1749051000000';

  async up(queryRunner) {
    // Criar tabela crop
    await queryRunner.createTable(
      new Table({
        name: 'crop',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Criar tabela harvest
    await queryRunner.createTable(
      new Table({
        name: 'harvest',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'farmId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'cropId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Criar foreign key entre harvest e farm
    await queryRunner.createForeignKey(
      'harvest',
      new TableForeignKey({
        columnNames: ['farmId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'farm',
        onDelete: 'CASCADE',
      }),
    );

    // Criar foreign key entre harvest e crop
    await queryRunner.createForeignKey(
      'harvest',
      new TableForeignKey({
        columnNames: ['cropId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crop',
        onDelete: 'CASCADE',
      }),
    );

    // Criar índice único para evitar duplicatas (fazenda + ano + cultura)
    await queryRunner.createIndex(
      'harvest',
      new TableIndex({
        name: 'IDX_HARVEST_FARM_YEAR_CROP',
        columnNames: ['farmId', 'year', 'cropId'],
        isUnique: true,
      }),
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('harvest');
    await queryRunner.dropTable('crop');
  }
}

module.exports = { AddCropAndHarvestTables1749051000000 }; 