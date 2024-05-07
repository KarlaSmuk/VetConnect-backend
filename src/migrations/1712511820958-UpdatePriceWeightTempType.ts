import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePriceWeightTempType1712511820958 implements MigrationInterface {
    name = 'UpdatePriceWeightTempType1712511820958'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

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
    }

}
