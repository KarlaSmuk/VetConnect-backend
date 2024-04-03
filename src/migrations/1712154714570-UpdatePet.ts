import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePet1712154714570 implements MigrationInterface {
    name = 'UpdatePet1712154714570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" ADD "neutered" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "gender" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "color" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "neutered"`);
    }

}
