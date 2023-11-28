import { Document, Types } from 'mongoose';
import Land from '../model/Land';
import { UpdateResult } from 'mongodb';
import { IId, IIdUserName } from '../constants';

interface ILand {
  name: string;
  horizontalRange: number;
  verticalRange: number;
  userId: Types.ObjectId;
}

interface ILandEdit {
  id: Types.ObjectId;
  name: string;
  horizontalRange: number;
  verticalRange: number;
}

class LandsRepository {
  public async create({
    name,
    horizontalRange,
    verticalRange,
    userId,
  }: ILand): Promise<Land | undefined> {
    const land = new Land({ name, horizontalRange, verticalRange, userId });
    await land.newModel().save();
    return land;
  }

  public async listById({
    id,
  }: IId): Promise<
    (Document<unknown, ILand> & ILand & { _id: Types.ObjectId }) | null
  > {
    const land = await Land.getModel().findOne({ _id: id });
    return land;
  }

  public async listByName({
    name,
    userId,
  }: IIdUserName): Promise<
    (Document<unknown, ILand> & ILand & { _id: Types.ObjectId }) | null
  > {
    const land = await Land.getModel().findOne({
      name,
      userId,
      removed: false,
    });
    return land;
  }

  public async edit({
    id,
    name,
    horizontalRange,
    verticalRange,
  }: ILandEdit): Promise<UpdateResult<Document>> {
    const updatedAt = new Date();
    const response = await Land.getModel()
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            name,
            horizontalRange,
            verticalRange,
            updatedAt,
          },
        },
      )
      .lean();
    return response;
  }

  public async delete({ id }: IId): Promise<UpdateResult<Document>> {
    const updatedAt = new Date();
    const land = await Land.getModel()
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
    return land;
  }
}

export default LandsRepository;
