import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwner1711909867728 implements MigrationInterface {
    name = 'AddOwner1711909867728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "photo" bytea, "userId" uuid, CONSTRAINT "REL_e59dfb8a17a2fd953467e9a92f" UNIQUE ("userId"), CONSTRAINT "PK_8e86b6b9f94aece7d12d465dc0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "owner" ADD CONSTRAINT "FK_e59dfb8a17a2fd953467e9a92f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owner" DROP CONSTRAINT "FK_e59dfb8a17a2fd953467e9a92f9"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "owner"`);
    }

}
