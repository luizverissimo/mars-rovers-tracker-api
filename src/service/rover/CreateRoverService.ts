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
    if (!name) throw new AppError('You must send rover name!');

    if (!userId) throw new AppError('You must send user id!');

    const userIdParsed = new Types.ObjectId(userId);

    const roverExists = await this.roversRepository.listByName({
      name,
      userId: userIdParsed,
    });

    if (roverExists) throw new AppError('This rover name already exists!');

    const rover = await this.roversRepository.create({
      name,
      userId: userIdParsed,
    });

    return rover;
  }
}
export default CreateRoverService;
