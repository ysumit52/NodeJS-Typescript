import dotenv from 'dotenv';
dotenv.config();

import config from 'config';

import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();
const port = config.get<number>('PORT');

app.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Hello from Knightrider' });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
