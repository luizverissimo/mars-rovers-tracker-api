import { Router } from 'express';
import UsersRepository from '../repository/usersRepository';
import CreateUserService from '../service/user/CreateUserService';
import passport from 'passport';
import ListUserByIdService from '../service/user/ListByIdUserService';
import EditUserService from '../service/user/EditUserService';
import DeleteUserService from '../service/user/DeleteUserService';

const usersRepository = new UsersRepository();

const usersRouter = Router();

/*
  @route      POST /user
  @desc       Create user
  @body       name, email, password
  @access     Public
*/
usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUservice = new CreateUserService(usersRepository);

  const user = await createUservice.execute({
    name,
    email,
    password,
  });

  return response.json(user);
});

/*
  @route      GET /user/:id
  @desc       Get user
  @access     Private
*/
usersRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;

    const listUserByIdService = new ListUserByIdService(usersRepository);

    const user = await listUserByIdService.execute(id);

    return response.json(user);
  },
);

/*
  @route      PUT /user/:id
  @desc       Edit user
  @body       name, email
  @access     Private
*/
usersRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;
    const { name, email } = request.body;

    const editUserService = new EditUserService(usersRepository);

    const user = await editUserService.execute({ id, name, email });

    return response.json(user);
  },
);

/*
  @route      DELETE /user/:id
  @desc       Delete user
  @body       id
  @access     Private
*/
usersRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;

    const deleteUserService = new DeleteUserService(usersRepository);

    await deleteUserService.execute({ id });

    return response.json({ ok: 'ok' });
  },
);

export default usersRouter;
