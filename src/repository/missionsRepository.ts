import { Document, Types } from 'mongoose';
import Mission, { IRoversMission } from '../model/Mission';
import { UpdateResult } from 'mongodb';

interface IId {
  id: Types.ObjectId;
}

interface IMissionEdit {
  id: Types.ObjectId;
  name: string;
  roversMission: IRoversMission[];
  landId: Types.ObjectId;
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

  public async listById({
    id,
  }: IId): Promise<
    (Document<unknown, IMission> & IMission & { _id: Types.ObjectId }) | null
  > {
    const mission = await Mission.getModel().findOne({ _id: id });
    return mission;
  }

  public async edit({
    id,
    name,
    roversMission,
    landId,
  }: IMissionEdit): Promise<UpdateResult<Document>> {
    const updatedAt = new Date();
    const response = await Mission.getModel()
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            name,
            roversMission,
            landId,
            updatedAt,
          },
        },
      )
      .lean();
    return response;
  }

  public async delete({ id }: IId): Promise<UpdateResult<Document>> {
    const updatedAt = new Date();
    const mission = await Mission.getModel()
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            removed: true,
            updatedAt,
          },
        },
      )
      .lean();
    return mission;
  }
}

export default MissionsRepository;
