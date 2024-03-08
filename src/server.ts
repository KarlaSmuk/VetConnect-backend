import express, {Express, Request, Response} from "express";
import Application from "./app";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT

Application.main();

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
});