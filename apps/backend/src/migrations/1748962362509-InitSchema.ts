import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1748962362509 implements MigrationInterface {
    name = 'InitSchema1748962362509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "producer" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "document" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, CONSTRAINT "UQ_65c993224b1827bdbb49113bd11" UNIQUE ("document"), CONSTRAINT "PK_4cfe496c2c70e4c9b9f444525a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farm" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "totalArea" double precision NOT NULL, "arableArea" double precision NOT NULL, "vegetationArea" double precision NOT NULL, "producerId" uuid, CONSTRAINT "PK_3bf246b27a3b6678dfc0b7a3f64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "farm" ADD CONSTRAINT "FK_babd3cbc05a05e30623511fd0c4" FOREIGN KEY ("producerId") REFERENCES "producer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_babd3cbc05a05e30623511fd0c4"`);
        await queryRunner.query(`DROP TABLE "farm"`);
        await queryRunner.query(`DROP TABLE "producer"`);
    }

}
