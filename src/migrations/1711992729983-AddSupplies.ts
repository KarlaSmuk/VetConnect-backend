import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupplies1711992729983 implements MigrationInterface {
    name = 'AddSupplies1711992729983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "supply" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "unitPrice" integer NOT NULL, "quantity" integer NOT NULL, "minimumStockLevel" integer NOT NULL, "clinicId" uuid, CONSTRAINT "PK_11dcdc2def0eb6d10ed3ae0180d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "supply" ADD CONSTRAINT "FK_4a536c355562caaa1defbd08bb9" FOREIGN KEY ("clinicId") REFERENCES "veterinary_clinic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supply" DROP CONSTRAINT "FK_4a536c355562caaa1defbd08bb9"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "supply"`);
    }

}
