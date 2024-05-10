import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1715364142963 implements MigrationInterface {
    name = 'Update1715364142963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "veterinarian" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "veterinarian" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photo" character varying`);
        await queryRunner.query(`ALTER TABLE "veterinarian" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "veterinarian" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

}
