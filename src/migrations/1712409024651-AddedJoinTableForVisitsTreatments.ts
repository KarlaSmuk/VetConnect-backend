import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedJoinTableForVisitsTreatments1712409024651 implements MigrationInterface {
    name = 'AddedJoinTableForVisitsTreatments1712409024651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "visit_treatments_treatment" ("visitId" uuid NOT NULL, "treatmentId" uuid NOT NULL, CONSTRAINT "PK_b7ce1e6d227107c9acb6f511f16" PRIMARY KEY ("visitId", "treatmentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_000e1c32ac579d48a62cf2a772" ON "visit_treatments_treatment" ("visitId") `);
        await queryRunner.query(`CREATE INDEX "IDX_37c8fb3cef530bc3a669a2c52b" ON "visit_treatments_treatment" ("treatmentId") `);
        await queryRunner.query(`ALTER TABLE "visit" DROP COLUMN "treatment"`);
        await queryRunner.query(`ALTER TABLE "working_hours" ALTER COLUMN "specialNotes" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" ADD CONSTRAINT "FK_000e1c32ac579d48a62cf2a7721" FOREIGN KEY ("visitId") REFERENCES "visit"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" ADD CONSTRAINT "FK_37c8fb3cef530bc3a669a2c52b9" FOREIGN KEY ("treatmentId") REFERENCES "treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" DROP CONSTRAINT "FK_37c8fb3cef530bc3a669a2c52b9"`);
        await queryRunner.query(`ALTER TABLE "visit_treatments_treatment" DROP CONSTRAINT "FK_000e1c32ac579d48a62cf2a7721"`);
        await queryRunner.query(`ALTER TABLE "working_hours" ALTER COLUMN "specialNotes" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "visit" ADD "treatment" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37c8fb3cef530bc3a669a2c52b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_000e1c32ac579d48a62cf2a772"`);
        await queryRunner.query(`DROP TABLE "visit_treatments_treatment"`);
    }

}
