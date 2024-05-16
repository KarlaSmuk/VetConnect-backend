import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePhotos1715870909441 implements MigrationInterface {
    name = 'UpdatePhotos1715870909441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "photo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "photo" bytea`);
    }

}
