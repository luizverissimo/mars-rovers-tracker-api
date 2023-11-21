import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import express from 'express';
import cors from 'cors';

import routes from './routes';

import database from './database';

import passport from 'passport';

import passportMiddleware from './middlewares/passport';

new database().connect();

const app = express();

app.use(passport.initialize());
passport.use(passportMiddleware);
app.use(express.json());
app.use(cors());

app.use(routes);

export default app;
