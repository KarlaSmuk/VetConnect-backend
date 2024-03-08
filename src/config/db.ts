import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { User } from '../models/user.module';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [User]
})