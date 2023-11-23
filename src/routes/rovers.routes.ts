import { Router } from 'express';
import passport from 'passport';
import CreateRoverService from '../service/rover/CreateRoverService';
import RoversRepository from '../repository/roversRepository';

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

export default roversRouter;
