import bodyParser from 'body-parser';
import cors from 'cors';

export const setUpMiddleware = (app: any) => {
    // parse application/json
    app.use(bodyParser.json());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cors());
};