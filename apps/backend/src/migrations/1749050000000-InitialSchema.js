const { Table, TableForeignKey } = require('typeorm');

class InitialSchema1749050000000 {
  name = 'InitialSchema1749050000000';

  async up(queryRunner) {
    // Criar tabela producer
    await queryRunner.createTable(
      new Table({
        name: 'producer',
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
          },
          {
            name: 'document',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Criar tabela farm
    await queryRunner.createTable(
      new Table({
        name: 'farm',
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
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'totalArea',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'arableArea',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'vegetationArea',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'producerId',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Criar foreign key entre farm e producer
    await queryRunner.createForeignKey(
      'farm',
      new TableForeignKey({
        columnNames: ['producerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'producer',
        onDelete: 'CASCADE',
      }),
    );

    // Garantir que a extensão uuid-ossp esteja instalada
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }

  async down(queryRunner) {
    await queryRunner.dropTable('farm');
    await queryRunner.dropTable('producer');
  }
}

module.exports = { InitialSchema1749050000000 }; 