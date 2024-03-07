import express, {Express, Request, Response} from "express";
const port = 8000;

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
});

app.get("/hi", (req: Request, res: Response) => {
    res.send("hiiiiiiii");
});

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`)
});