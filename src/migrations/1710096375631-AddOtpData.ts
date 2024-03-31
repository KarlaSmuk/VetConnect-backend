import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpData1710096375631 implements MigrationInterface {
    name = 'AddOtpData1710096375631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "otp_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp" integer NOT NULL, "expiration" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL, "attemptsCount" integer NOT NULL, "lastAttemptTime" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL, "userId" uuid, CONSTRAINT "PK_a24f85db3835f6b91baa69c06e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD CONSTRAINT "FK_39a39319fc3bc66b80282605efc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp_data" DROP CONSTRAINT "FK_39a39319fc3bc66b80282605efc"`);
        await queryRunner.query(`DROP TABLE "otp_data"`);
    }

}
