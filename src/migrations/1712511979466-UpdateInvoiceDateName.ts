import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvoiceDateName1712511979466 implements MigrationInterface {
    name = 'UpdateInvoiceDateName1712511979466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "issueDate" TO "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" RENAME COLUMN "createdAt" TO "issueDate"`);
    }

}
