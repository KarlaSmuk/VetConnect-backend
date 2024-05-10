import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1715332943381 implements MigrationInterface {
    name = 'UpdateUser1715332943381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "visit" ALTER COLUMN "time" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "working_hours" ALTER COLUMN "specialNotes" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" ALTER COLUMN "specialNotes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit" ALTER COLUMN "time" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDeleted"`);
    }

}
