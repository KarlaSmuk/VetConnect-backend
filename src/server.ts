import 'reflect-metadata';
import express, { Express } from "express";
import Application from "./app";
import dotenv from 'dotenv';
import { setUpMiddleware } from './config/middleware';
import userRoute from './routes/user.router';
import otpRoute from './routes/otp.router';
import vetClinicRoute from './routes/clinic.router';
import petRoute from './routes/pet.router';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT

setUpMiddleware(app);

Application.main();

app.use('/api/user', userRoute)
app.use('/api/otp', otpRoute)
app.use('/api/clinic', vetClinicRoute)
app.use('/api/pet', petRoute)

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
});