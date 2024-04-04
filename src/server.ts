import 'reflect-metadata';
import express, { Express } from "express";
import Application from "./app";
import dotenv from 'dotenv';
import { setUpMiddleware } from './config/middleware';
import userRoute from './routes/user.router';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT

setUpMiddleware(app);

Application.main();

app.use('/api/user', userRoute)

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
});