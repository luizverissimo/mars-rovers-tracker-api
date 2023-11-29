import { Types } from 'mongoose';
import Mission, { IRoversMission } from '../../model/Mission';
import MissionsRepository from '../../repository/missionsRepository';
import AppError from '../../errors/AppError';
import LandsRepository from '../../repository/landsRepository';
import UsersRepository from '../../repository/usersRepository';
import RoversRepository from '../../repository/roversRepository';

interface Request {
  name: string;
  roversMission: IRoversMission[];
  landId: string;
  userId: string;
}

class CreateMissionService {
  private missionsRepository: MissionsRepository;
  private landsRepository: LandsRepository;
  private usersRepository: UsersRepository;
  private roversRepository: RoversRepository;

  constructor() {
    this.missionsRepository = new MissionsRepository();
    this.landsRepository = new LandsRepository();
    this.usersRepository = new UsersRepository();
    this.roversRepository = new RoversRepository();
  }
  public async execute({
    name,
    roversMission,
    landId,
    userId,
  }: Request): Promise<Mission | undefined> {
    if (!name) throw new AppError('You must send mission name!');
    if (!roversMission)
      throw new AppError('You must send mission roversMission!');
    if (!landId) throw new AppError('You must send mission landId!');
    if (!userId) throw new AppError('You must send mission userId!');

    const userIdParsed = new Types.ObjectId(userId);
    const landIdParsed = new Types.ObjectId(landId);

    const landsExists = await this.landsRepository.listById({
      id: landIdParsed,
    });
    if (!landsExists) throw new AppError('Land not found!');

    const userExists = await this.usersRepository.listById({
      id: userIdParsed,
    });
    if (!userExists) throw new AppError('User not found!');

    for (const key in roversMission) {
      const userIdParsed = new Types.ObjectId(roversMission[key].roverId);
      const roversExists = await this.roversRepository.listById({
        id: userIdParsed,
      });
      if (!roversExists) throw new AppError('Rover not found!');
    }

    const missionExists = await this.missionsRepository.listByName({
      name,
      userId: userIdParsed,
    });

    if (missionExists) throw new AppError('This mission already exists!');

    const mission = await this.missionsRepository.create({
      name,
      roversMission: roversMission as IRoversMission[],
      landId: landIdParsed,
      userId: userIdParsed,
    });

    return mission;
  }
}
export default CreateMissionService;
