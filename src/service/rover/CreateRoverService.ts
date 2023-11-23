import { Schema, Types } from 'mongoose';
import Rover from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';
import AppError from '../../errors/AppError';

interface Request {
  name: string;
  userId: string;
}

class CreateRoverService {
  private roversRepository: RoversRepository;

  constructor(roversRepository: RoversRepository) {
    this.roversRepository = roversRepository;
  }
  public async execute({ name, userId }: Request): Promise<Rover | undefined> {
    if (!userId) {
      throw new AppError('User must be inserted.');
    }

    const userIdParsed = new Types.ObjectId(userId);

    const rover = await this.roversRepository.create({
      name,
      userId: userIdParsed,
    });

    return rover;
  }
}
export default CreateRoverService;
