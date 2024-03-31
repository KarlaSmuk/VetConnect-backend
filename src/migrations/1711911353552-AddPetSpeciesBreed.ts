import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPetSpeciesBreed1711911353552 implements MigrationInterface {
    name = 'AddPetSpeciesBreed1711911353552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "breed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "speciesId" uuid, CONSTRAINT "PK_d1c857f060076296ce8a87b9043" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "species" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "dateOfBirth" TIMESTAMP NOT NULL, "photo" bytea, "ownerId" uuid, "speciesId" uuid, "breedId" uuid, CONSTRAINT "PK_b1ac2e88e89b9480e0c5b53fa60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "breed" ADD CONSTRAINT "FK_e0b8d5f06e5174dfa885e45b9e7" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_20acc45f799c122ec3735a3b8b1" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_d5b9ba337297b043bd8b264c554" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pet" ADD CONSTRAINT "FK_9bcbad056bb61c2d5e3fbf5cef6" FOREIGN KEY ("breedId") REFERENCES "breed"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_9bcbad056bb61c2d5e3fbf5cef6"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_d5b9ba337297b043bd8b264c554"`);
        await queryRunner.query(`ALTER TABLE "pet" DROP CONSTRAINT "FK_20acc45f799c122ec3735a3b8b1"`);
        await queryRunner.query(`ALTER TABLE "breed" DROP CONSTRAINT "FK_e0b8d5f06e5174dfa885e45b9e7"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "isUsed" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "lastAttemptTime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "attemptsCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "otp_data" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "pet"`);
        await queryRunner.query(`DROP TABLE "species"`);
        await queryRunner.query(`DROP TABLE "breed"`);
    }

}
