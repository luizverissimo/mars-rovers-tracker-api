import { Router } from 'express';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import roversRouter from './rovers.routes';
import landsRouter from './lands.routes';
import missionsRouter from './missions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/rovers', roversRouter);
routes.use('/lands', landsRouter);
routes.use('/missions', missionsRouter);

export default routes;
