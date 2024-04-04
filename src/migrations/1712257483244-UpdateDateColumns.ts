import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateColumns1712257483244 implements MigrationInterface {
    name = 'UpdateDateColumns1712257483244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supply" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" DROP COLUMN "expiration"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD "expiration" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" DROP COLUMN "lastAttemptTime"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD "lastAttemptTime" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "issueDate"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "issueDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "time" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "time" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "issueDate"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "issueDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" DROP COLUMN "lastAttemptTime"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD "lastAttemptTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "otp_data" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "otp_data" DROP COLUMN "expiration"`);
        await queryRunner.query(`ALTER TABLE "otp_data" ADD "expiration" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supply" DROP COLUMN "updated"`);
    }

}
