import { Router } from 'express';
import passport from 'passport';
import LandsRepository from '../repository/landsRepository';
import CreateLandService from '../service/land/CreateLandService';
import ListByIdRoverService from '../service/land/ListByIdLandService';
import EditLandService from '../service/land/EditLandService';
import DeleteLandService from '../service/land/DeleteLand';

const landsRepository = new LandsRepository();

const landsRouter = Router();

/*
  @route      POST /lands
  @desc       Create land
  @body       name, horizontalRange, verticalRange, userId
  @access     Public
*/
landsRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { name, horizontalRange, verticalRange, userId } = request.body;

    const createLandService = new CreateLandService(landsRepository);

    const land = await createLandService.execute({
      name,
      horizontalRange,
      verticalRange,
      userId,
    });

    return response.json(land);
  },
);

/*
  @route      GET /lands
  @desc       Get land
  @params     id
  @access     Public
*/
landsRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;
    const listByIdLandService = new ListByIdRoverService(landsRepository);
    const land = await listByIdLandService.execute({
      id,
    });
    return response.json(land);
  },
);

/*
  @route      POST /lands
  @desc       Edit land
  @params     id
  @body       name, horizontalRange, verticalRange
  @access     Public
*/
landsRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { name, horizontalRange, verticalRange } = request.body;
    const { id } = request.params;
    const editLandService = new EditLandService(landsRepository);
    const land = await editLandService.execute({
      id,
      name,
      horizontalRange,
      verticalRange,
    });
    return response.json(land);
  },
);

/*
  @route      DELETE /lands
  @desc       Delete land
  @patams       id
  @access     Public
*/
landsRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const { id } = request.params;
    const deleteLandService = new DeleteLandService(landsRepository);
    await deleteLandService.execute({
      id,
    });
    return response.json({ ok: 'ok' });
  },
);

export default landsRouter;
