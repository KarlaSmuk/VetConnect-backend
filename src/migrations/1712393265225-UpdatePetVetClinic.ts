import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePetVetClinic1712393265225 implements MigrationInterface {
    name = 'UpdatePetVetClinic1712393265225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pet_status_enum" AS ENUM('Živ', 'Preminuo', 'Nestao')`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "status" "public"."pet_status_enum" NOT NULL DEFAULT 'Živ'`);
        await queryRunner.query(`ALTER TABLE "pet" ADD "deceasedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "veterinarian" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "veterinarian" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "veterinary_clinic" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "veterinary_clinic" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "veterinary_clinic" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "veterinary_clinic" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "veterinarian" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "veterinarian" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "deceasedAt"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."pet_status_enum"`);
    }

}
