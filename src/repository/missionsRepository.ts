import { Types } from 'mongoose';
import Mission from '../model/Mission';

export interface IRoversMission {
  roverId: Types.ObjectId;
  pathCommands: string;
  intial: {
    x: string;
    y: string;
    orientation: string;
  };
}

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
