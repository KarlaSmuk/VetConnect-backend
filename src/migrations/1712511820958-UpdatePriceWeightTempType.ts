import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePriceWeightTempType1712511820958 implements MigrationInterface {
    name = 'UpdatePriceWeightTempType1712511820958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" DROP CONSTRAINT "FK_000e1c32ac579d48a62cf2a7721"`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" DROP CONSTRAINT "FK_37c8fb3cef530bc3a669a2c52b9"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "totalPrice" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD "totalPrice" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "treatment" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "treatment" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "weight" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "temperature"`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "temperature" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" ADD CONSTRAINT "FK_000e1c32ac579d48a62cf2a7721" FOREIGN KEY ("visitId") REFERENCES "visit"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" ADD CONSTRAINT "FK_37c8fb3cef530bc3a669a2c52b9" FOREIGN KEY ("treatmentId") REFERENCES "treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" DROP CONSTRAINT "FK_37c8fb3cef530bc3a669a2c52b9"`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" DROP CONSTRAINT "FK_000e1c32ac579d48a62cf2a7721"`);
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "temperature"`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "temperature" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "weight" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "treatment" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "treatment" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD "totalPrice" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "totalPrice" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" ADD CONSTRAINT "FK_37c8fb3cef530bc3a669a2c52b9" FOREIGN KEY ("treatmentId") REFERENCES "treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" ADD CONSTRAINT "FK_000e1c32ac579d48a62cf2a7721" FOREIGN KEY ("visitId") REFERENCES "visit"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

}
