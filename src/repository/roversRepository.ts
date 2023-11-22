import { Schema } from 'mongoose';
import Rover from '../model/Rover';

interface IRover {
  name: string;
  userId: Schema.Types.ObjectId;
}

class RoversRepository {
  public async create({ name, userId }: IRover): Promise<Rover | undefined> {
    const rover = new Rover({ name, userId });
    await rover.newModel().save();
    return rover;
  }
}

export default RoversRepository;
