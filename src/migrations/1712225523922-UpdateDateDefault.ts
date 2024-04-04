import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateDefault1712225523922 implements MigrationInterface {
    name = 'UpdateDateDefault1712225523922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "visit" ALTER COLUMN "time" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "issueDate" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "issueDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "visit" ALTER COLUMN "time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
