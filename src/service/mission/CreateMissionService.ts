import { Types } from 'mongoose';
import Mission, { IRoversMission } from '../../model/Mission';
import MissionsRepository from '../../repository/missionsRepository';

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
    const userIdParsed = new Types.ObjectId(userId);
    const landIdParsed = new Types.ObjectId(landId);

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
