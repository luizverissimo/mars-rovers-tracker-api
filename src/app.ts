import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import cors from 'cors';

import routes from './routes';

import database from './database';

import passport from 'passport';

import passportMiddleware from './middlewares/passport';

import AppError from './errors/AppError';

if (process.env.NODE_ENV !== 'test') new database().connect();

const app = express();

app.use(passport.initialize());
passport.use(passportMiddleware);
app.use(express.json());
app.use(cors());
app.use(routes);
app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;
