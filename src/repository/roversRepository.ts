import { Document, Types } from 'mongoose';
import Rover from '../model/Rover';
import { UpdateResult } from 'mongodb';

interface IId {
  id: Types.ObjectId;
}

interface IRoverEdit {
  id: Types.ObjectId;
  name: string;
}

interface IRover {
  name: string;
  userId: Types.ObjectId;
}

class RoversRepository {
  public async create({ name, userId }: IRover): Promise<Rover | undefined> {
    const rover = new Rover({ name, userId });
    await rover.newModel().save();
    return rover;
  }

  public async listById({
    id,
  }: IId): Promise<
    (Document<unknown, IRover> & IRover & { _id: Types.ObjectId }) | null
  > {
    const rover = await Rover.getModel().findOne({ _id: id });
    return rover;
  }

  public async edit({ id, name }: IRoverEdit): Promise<UpdateResult<Document>> {
    const updatedAt = new Date();
    const response = await Rover.getModel()
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            name,
            updatedAt,
          },
        },
      )
      .lean();
    return response;
  }

  public async delete({ id }: IId): Promise<UpdateResult<Document>> {
    const updatedAt = new Date();
    const rover = await Rover.getModel()
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
    return rover;
  }
}

export default RoversRepository;
