import { Types } from 'mongoose';
import Mission, { IRoversMission } from '../model/Mission';

interface IMission {
  name: string;
  roversMission: IRoversMission[];
  landId: Types.ObjectId;
  userId: Types.ObjectId;
}

class MissionsRepository {
  public async create({
    name,
    roversMission,
    landId,
    userId,
  }: IMission): Promise<Mission | undefined> {
    const mission = new Mission({
      name,
      roversMission,
      landId,
      userId,
    });
    await mission.newModel().save();
    return mission;
  }
}

export default MissionsRepository;
