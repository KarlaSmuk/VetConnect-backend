import 'reflect-metadata';
import express, { Express } from "express";
import Application from "./app";
import dotenv from 'dotenv';
import { setUpMiddleware } from './config/middleware';
import userRoute from './routes/user.router';
import otpRoute from './routes/otp.router';
import vetClinicRoute from './routes/clinic.router';
import petRoute from './routes/pet.router';
import visitRoute from './routes/visit.router';
import invoiceRoute from './routes/invoice.router';
import ownersRoute from './routes/owner.router';
import vetsRoute from './routes/vet.router';
import authRoute from './routes/auth.router';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT

setUpMiddleware(app);

Application.main();

app.use('/api/user', userRoute)
app.use('/api/owners', ownersRoute)
app.use('/api/veterinarians', vetsRoute)
app.use('/api/otp', otpRoute)
app.use('/api/clinic', vetClinicRoute)
app.use('/api/pet', petRoute)
app.use('/api/visit', visitRoute)
app.use('/api/invoice', invoiceRoute)
app.use('/api/auth', authRoute)


app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
});