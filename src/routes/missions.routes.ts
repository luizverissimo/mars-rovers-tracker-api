import { Router } from 'express';
import passport from 'passport';
import MissionsRepository from '../repository/missionsRepository';
import CreateMissionService from '../service/mission/CreateMissionService';

const missionsRepository = new MissionsRepository();

const missionsRouter = Router();

/*
  @route      POST /missions
  @desc       Create mission
  @body       name, email, userId
  @access     Public
*/
missionsRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { name, roversMission, landId, userId } = request.body;
    const createMissionService = new CreateMissionService(missionsRepository);
    const mission = await createMissionService.execute({
      name,
      roversMission,
      landId,
      userId,
    });
    return response.json(mission);
  },
);

export default missionsRouter;
