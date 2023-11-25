import { Router } from 'express';
import passport from 'passport';
import MissionsRepository from '../repository/missionsRepository';
import CreateMissionService from '../service/mission/CreateMissionService';
import ListByIdMissionsService from '../service/mission/ListByIdMissionService';
import EditMissionService from '../service/mission/EditMissionService';
import DeleteMissiondService from '../service/mission/DeleteMission';

const missionsRepository = new MissionsRepository();

const missionsRouter = Router();

/*
  @route      POST /missions
  @desc       Create mission
  @body       name, roversMission, landId, userId
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

/*
  @route      GET /missions
  @desc       List mission
  @access     Public
*/
missionsRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;
    const listByIdMissionsService = new ListByIdMissionsService(
      missionsRepository,
    );
    const mission = await listByIdMissionsService.execute({
      id,
    });
    return response.json(mission);
  },
);

/*
  @route      PUT /missions
  @desc       Edit mission
  @body       name, roversMission, landId
  @params     id
  @access     Public
*/
missionsRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { name, roversMission, landId } = request.body;
    const { id } = request.params;
    const editMissionService = new EditMissionService(missionsRepository);
    const mission = await editMissionService.execute({
      id,
      name,
      roversMission,
      landId,
    });
    return response.json(mission);
  },
);

/*
  @route      DELETE /missions
  @desc       Delete mission
  @params       id
  @access     Public
*/
missionsRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;
    const deleteMissiondService = new DeleteMissiondService(missionsRepository);
    await deleteMissiondService.execute({
      id,
    });
    return response.json({ ok: 'ok' });
  },
);

export default missionsRouter;
