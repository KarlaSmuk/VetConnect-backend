import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVeterinarianClinicWorkingHours1711913334065 implements MigrationInterface {
    name = 'AddVeterinarianClinicWorkingHours1711913334065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "veterinarian" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "clinicId" uuid, CONSTRAINT "REL_621ed83931efcb5bf706ae8927" UNIQUE ("userId"), CONSTRAINT "PK_f747fb2870fc56cd0f030cbea71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "veterinary_clinic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "oib" character varying NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "county" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "webAddress" character varying NOT NULL, CONSTRAINT "PK_cebaa6c9db2868e462dc8b9425e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" integer NOT NULL, "openingTime" character varying NOT NULL, "closingTime" character varying NOT NULL, "specialNotes" character varying NOT NULL, "clinicId" uuid, CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "veterinarian" ADD CONSTRAINT "FK_621ed83931efcb5bf706ae89276" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "veterinarian" ADD CONSTRAINT "FK_400f4da73fd86095cc32b6c08c2" FOREIGN KEY ("clinicId") REFERENCES "veterinary_clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD CONSTRAINT "FK_768ffb97a5326a414f180bb3edf" FOREIGN KEY ("clinicId") REFERENCES "veterinary_clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "working_hours" DROP CONSTRAINT "FK_768ffb97a5326a414f180bb3edf"`);
        await queryRunner.query(`ALTER TABLE "veterinarian" DROP CONSTRAINT "FK_400f4da73fd86095cc32b6c08c2"`);
        await queryRunner.query(`ALTER TABLE "veterinarian" DROP CONSTRAINT "FK_621ed83931efcb5bf706ae89276"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "working_hours"`);
        await queryRunner.query(`DROP TABLE "veterinary_clinic"`);
        await queryRunner.query(`DROP TABLE "veterinarian"`);
    }

}
