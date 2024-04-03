import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvoice1712154345440 implements MigrationInterface {
    name = 'AddInvoice1712154345440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issueDate" TIMESTAMP NOT NULL, "totalPrice" double precision NOT NULL, "visitId" uuid, CONSTRAINT "REL_76cfb73c03a40a0ea02a9606c0" UNIQUE ("visitId"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "totalPrice" double precision NOT NULL, "treatmentId" uuid, "invoiceId" uuid, CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_76cfb73c03a40a0ea02a9606c01" FOREIGN KEY ("visitId") REFERENCES "visit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_8890a0c8e593d4a77b4f1a86ba2" FOREIGN KEY ("treatmentId") REFERENCES "treatment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_item" ADD CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_553d5aac210d22fdca5c8d48ead"`);
        await queryRunner.query(`ALTER TABLE "invoice_item" DROP CONSTRAINT "FK_8890a0c8e593d4a77b4f1a86ba2"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_76cfb73c03a40a0ea02a9606c01"`);
        await queryRunner.query(`DROP TABLE "invoice_item"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
    }

}
