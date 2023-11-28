import { Types } from 'mongoose';
import Mission, { IRoversMission } from '../../model/Mission';
import MissionsRepository from '../../repository/missionsRepository';
import AppError from '../../errors/AppError';

interface Request {
  name: string;
  roversMission: object[];
  landId: string;
  userId: string;
}

class CreateMissionService {
  private missionsRepository: MissionsRepository;

  constructor(missionsRepository: MissionsRepository) {
    this.missionsRepository = missionsRepository;
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
