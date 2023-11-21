import { Router } from 'express';
import AuthenticateUserService from '../service/session/AuthenticateUser';
import UsersRepository from '../repository/usersRepository';

const usersRepositoryRepository = new UsersRepository();
const sessionsRouter = Router();
/*
  @route      POST /sessions
  @desc       Authenticate user
  @body       email, password
  @access     Public
*/
sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticatesessionservice = new AuthenticateUserService(
      usersRepositoryRepository,
    );

    const token = await authenticatesessionservice.execute({ email, password });

    return response.json({ sucess: true, token: 'Bearer ' + token });
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return response.status(400).json({ error: errorMessage });
  }
});

export default sessionsRouter;
