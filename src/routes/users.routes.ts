import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  return response.json({ ok: 'ok' });
});

export default usersRouter;
