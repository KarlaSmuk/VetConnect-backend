import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvoiceRelation1716843852558 implements MigrationInterface {
    name = 'UpdateInvoiceRelation1716843852558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_76cfb73c03a40a0ea02a9606c01"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "REL_76cfb73c03a40a0ea02a9606c0"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_76cfb73c03a40a0ea02a9606c01" FOREIGN KEY ("visitId") REFERENCES "visit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_76cfb73c03a40a0ea02a9606c01"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "REL_76cfb73c03a40a0ea02a9606c0" UNIQUE ("visitId")`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_76cfb73c03a40a0ea02a9606c01" FOREIGN KEY ("visitId") REFERENCES "visit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
