import { Router } from 'express';
import passport from 'passport';
import CreateRoverService from '../service/rover/CreateRoverService';
import RoversRepository from '../repository/roversRepository';
import ListByIdRoverService from '../service/rover/ListByIdRoverService';
import EditRoverService from '../service/rover/EditRoverService';
import DeleteRoverService from '../service/rover/DeleteRoverService';

const roversRepository = new RoversRepository();

const roversRouter = Router();

/*
  @route      POST /rovers
  @desc       Create rover
  @body        name, userId
  @access     Public
*/
roversRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { name, userId } = request.body;

    const createRoverService = new CreateRoverService(roversRepository);

    const rover = await createRoverService.execute({
      name,
      userId,
    });

    return response.json(rover);
  },
);

/*
  @route      GET /rovers
  @desc       List rover
  @access     Public
*/
roversRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;

    const listByIdRoverService = new ListByIdRoverService(roversRepository);

    const rover = await listByIdRoverService.execute({ id });

    return response.json(rover);
  },
);

/*
  @route      PUT /rovers
  @desc       Edit rover
  @params     id
  @body       name
  @access     Public
*/
roversRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;
    const { name } = request.body;

    const editRoverService = new EditRoverService(roversRepository);

    const rover = await editRoverService.execute({
      id,
      name,
    });

    return response.json(rover);
  },
);

/*
  @route      DELETE /rovers
  @params     id
  @desc       Delete rover
  @access     Public
*/
roversRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;

    const deleteRoverService = new DeleteRoverService(roversRepository);

    await deleteRoverService.execute({
      id,
    });

    return response.json({ ok: 'ok' });
  },
);

export default roversRouter;
