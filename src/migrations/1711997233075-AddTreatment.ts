import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTreatment1711997233075 implements MigrationInterface {
    name = 'AddTreatment1711997233075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "treatment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "price" double precision NOT NULL, "clinicId" uuid, CONSTRAINT "PK_5ed256f72665dee35f8e47b416e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "unitPrice"`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "minimumStockLevel"`);
        await queryRunner.query(`ALTER TABLE "supply" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supply" ADD "stockQuantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supply" ADD "minimumRequired" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "treatment" ADD CONSTRAINT "FK_3cc7cd76ac355afacadc96355b3" FOREIGN KEY ("clinicId") REFERENCES "veterinary_clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "treatment" DROP CONSTRAINT "FK_3cc7cd76ac355afacadc96355b3"`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "minimumRequired"`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "stockQuantity"`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "supply" ADD "minimumStockLevel" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supply" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supply" ADD "unitPrice" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "treatment"`);
    }

}
