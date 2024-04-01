import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVisit1711994855334 implements MigrationInterface {
    name = 'AddVisit1711994855334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "visit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "time" TIMESTAMP NOT NULL, "weight" double precision NOT NULL, "temperature" double precision NOT NULL, "diagnosis" character varying NOT NULL, "treatment" character varying NOT NULL, "notes" character varying NOT NULL, "petId" uuid, "veterinarianId" uuid, CONSTRAINT "PK_c9919ef5a07627657c535d8eb88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit" ADD CONSTRAINT "FK_67a09501ceaaad778cf7adb53bc" FOREIGN KEY ("petId") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "visit" ADD CONSTRAINT "FK_62d3050a52a63d593eb0e162ea3" FOREIGN KEY ("veterinarianId") REFERENCES "veterinarian"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit" DROP CONSTRAINT "FK_62d3050a52a63d593eb0e162ea3"`);
        await queryRunner.query(`ALTER TABLE "visit" DROP CONSTRAINT "FK_67a09501ceaaad778cf7adb53bc"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "visit"`);
    }

}
