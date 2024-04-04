import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const rootDir = process.env.NODE_ENV == "development" ?
  "src" :
  "dist"

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    migrationsRun: true,
    entities: [rootDir + "/**/*.entity{.ts,.js}"],
    migrations: [rootDir + "/migrations/*.{js,ts}"],
    migrationsTableName: "migrations"
})