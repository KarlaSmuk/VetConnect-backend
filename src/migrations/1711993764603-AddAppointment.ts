import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppointment1711993764603 implements MigrationInterface {
    name = 'AddAppointment1711993764603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."appointment_status_enum" AS ENUM('Zakazano', 'Dovršeno', 'Otkazano', 'Nepojavljivanje')`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "time" TIMESTAMP NOT NULL, "purpose" character varying NOT NULL, "status" "public"."appointment_status_enum" NOT NULL, "petId" uuid, "clinicId" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_c4e922028ecd83c496e24aad5be" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_8fb4ae178c6bd844f42f69ae686" FOREIGN KEY ("clinicId") REFERENCES "veterinary_clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_8fb4ae178c6bd844f42f69ae686"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_c4e922028ecd83c496e24aad5be"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TYPE "public"."appointment_status_enum"`);
    }

}
