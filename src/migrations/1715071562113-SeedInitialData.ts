import { MigrationInterface, QueryRunner } from "typeorm";
import { hash } from 'bcrypt';
import { UserRole } from "../constants/roles.enum";

export class SeedInitialData1715071562113 implements MigrationInterface {
    name = 'SeedInitialData1715071562113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Hash passwords
        const adminPassword = await hash('admin', 10);
        const ownerPassword = await hash('owner', 10);
        const vetPassword = await hash('vet', 10);

        // Insert Admin, Owner, and Vet users with unique constraint handling
        await queryRunner.query(
            `INSERT INTO "user" ("email", "firstName", "lastName", "phoneNumber", "password", "role")
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
            ['admin@admin.com', 'admin', 'admin', '000000000', adminPassword, UserRole.ADMIN]
        );
        
        await queryRunner.query(
            `INSERT INTO "user" ("email", "firstName", "lastName", "phoneNumber", "password", "role")
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
            ['owner@owner.com', 'John', 'Doe', '1234567890', ownerPassword, UserRole.OWNER]
        );

        const userId = (await queryRunner.query(
            `SELECT id FROM "user" WHERE "email" = $1`,
            ['owner@owner.com']
        ))[0].id;

        await queryRunner.query(
            `INSERT INTO "owner" ("userId")
             VALUES ($1)`,
            [ userId]
        );

        const ownerId = (await queryRunner.query(
            `SELECT id FROM "owner" WHERE "userId" = $1`, 
            [userId]
        ))[0].id;

        // Insert Species and Breed
        await queryRunner.query(
            `INSERT INTO "species" ("name") VALUES ($1) ON CONFLICT DO NOTHING`,
            ['Dog']
        );

        const speciesId = (await queryRunner.query(
            `SELECT id FROM "species" WHERE "name" = $1`,
            ['Dog']
        ))[0].id;

        await queryRunner.query(
            `INSERT INTO "breed" ("name", "speciesId")
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            ['Golden Retriever', speciesId]
        );

        const breedId = (await queryRunner.query(
            `SELECT id FROM "breed" WHERE "name" = $1`,
            ['Golden Retriever']
        ))[0].id;

        // Insert Pet
        await queryRunner.query(
            `INSERT INTO "pet" ("name", "dateOfBirth", "neutered", "gender", "color", "ownerId", "speciesId", "breedId")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            ['Rex', '2018-01-01', false, 'Male', 'Golden', ownerId, speciesId, breedId]
        );

        // Insert Vet Clinic
        await queryRunner.query(
            `INSERT INTO "veterinary_clinic" ("oib", "name", "address", "county", "phoneNumber", "email", "webAddress")
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            ['12345678901', 'Veterinarska Klinika', 'Ilica 42, 10000 Zagreb', 'Grad Zagreb', '+385 1 2345 678', 'info@vet.hr', 'www.vet.hr']
        );

        const clinicId = (await queryRunner.query(
            `SELECT id FROM "veterinary_clinic" WHERE "oib" = $1`,
            ['12345678901']
        ))[0].id;

        const workingHoursData = [
            { day: 1, openingTime: '08:00', closingTime: '18:00', specialNotes: '' },
            { day: 2, openingTime: '10:00', closingTime: '16:00', specialNotes: '' },
            { day: 3, openingTime: '08:00', closingTime: '18:00', specialNotes: '' },
            { day: 4, openingTime: '08:00', closingTime: '20:00', specialNotes: '' },
            { day: 5, openingTime: '08:00', closingTime: '18:00', specialNotes: '' },
            { day: 6, openingTime: '09:00', closingTime: '12:00', specialNotes: 'Hitni slučajevi' }
        ];

        for (const wh of workingHoursData) {
            await queryRunner.query(
                `INSERT INTO "working_hours" ("clinicId", "dayOfWeek", "openingTime", "closingTime", "specialNotes")
                 VALUES ($1, $2, $3, $4, $5)`,
                [clinicId, wh.day, wh.openingTime, wh.closingTime, wh.specialNotes]
            );
        }

        // Insert Vet user and Veterinarian
        await queryRunner.query(
            `INSERT INTO "user" ("email", "firstName", "lastName", "phoneNumber", "password", "role")
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
            ['vet@vet.com', 'Ivan', 'Horvat', '+385 91 234 5678', vetPassword, UserRole.VET]
        );

        const vetUserId = (await queryRunner.query(
            `SELECT id FROM "user" WHERE "email" = $1`,
            ['vet@vet.com']
        ))[0].id;

        await queryRunner.query(
            `INSERT INTO "veterinarian" ("userId", "clinicId")
             VALUES ($1, $2)`,
            [vetUserId, clinicId]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM veterinarian WHERE userId IN (SELECT id FROM user WHERE email = 'vet@vet.com')");
        await queryRunner.query("DELETE FROM user WHERE email IN ('vet@vet.com', 'owner@owner.com', 'admin@admin.com')");
        await queryRunner.query("DELETE FROM veterinary_clinic WHERE oib = '12345678901'");
        await queryRunner.query("DELETE FROM pet WHERE name = 'Rex' AND ownerId IN (SELECT id FROM owner WHERE lastName = 'Doe')");
        await queryRunner.query("DELETE FROM breed WHERE name = 'Golden Retriever'");
        await queryRunner.query("DELETE FROM species WHERE name = 'Dog'");
        await queryRunner.query("DELETE FROM owner WHERE lastName = 'Doe' AND userId IN (SELECT id FROM user WHERE email = 'owner@owner.com')");
    }
    

}
