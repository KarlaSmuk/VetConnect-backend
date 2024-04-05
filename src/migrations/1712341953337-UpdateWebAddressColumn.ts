import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWebAddressColumn1712341953337 implements MigrationInterface {
    name = 'UpdateWebAddressColumn1712341953337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "veterinary_clinic" ALTER COLUMN "webAddress" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "veterinary_clinic" ALTER COLUMN "webAddress" SET NOT NULL`);
    }

}
