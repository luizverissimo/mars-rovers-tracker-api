import { Types } from 'mongoose';
import Land from '../model/Land';

interface ILand {
  name: string;
  horizontalRange: number;
  verticalRange: number;
  userId: Types.ObjectId;
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
}

export default LandsRepository;
