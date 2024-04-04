import { RequestHandler, response } from 'express';

export const helloWorld:RequestHandler = (req, res, next) => {
    res.status(201).json(
        {message: 'Hello world'}
    );
};