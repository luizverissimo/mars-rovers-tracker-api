import { Router } from 'express';
import AuthenticateUserService from '../service/session/AuthenticateUser';

const sessionsRouter = Router();
/*
  @route      POST /sessions
  @desc       Authenticate user
  @body       email, password
  @access     Public
*/
sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticatesessionservice = new AuthenticateUserService();

  const token = await authenticatesessionservice.execute({ email, password });

  return response.json({ sucess: true, token: 'Bearer ' + token });
});

export default sessionsRouter;
