import { Router } from 'express';
import passport from 'passport';
import LandsRepository from '../repository/landsRepository';
import CreateLandService from '../service/land/CreateLandService';

const landsRepository = new LandsRepository();

const landsRouter = Router();

/*
  @route      POST /lands
  @desc       Create rover
  @body       name, email, userId
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

export default landsRouter;
