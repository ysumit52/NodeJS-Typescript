/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();

import config from 'config';
import cors from 'cors';

import routes from './routes';

import express, { Application, NextFunction, Request, Response } from 'express';
import { ErrorModel } from './interfaces/error.model';
import connectDB from './utils/connectDB';
import { json } from 'body-parser';

const app: Application = express();
const port = config.get<number>('port');

app.use(cors());

app.use(json({ limit: '1000kb' }));

// Routes
routes(app);

// UnKnown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: ErrorModel, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const start = async (): Promise<void> => {
  try {
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
    await connectDB();
  } catch (error: unknown) {
    console.error(
      `Server Error: ${(error as { message: string })?.message || error}`
    );
    process.exit(1);
  }
};

void start();
