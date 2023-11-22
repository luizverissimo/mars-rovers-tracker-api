import { Types } from 'mongoose';
// import AppError from '../../errors/AppError';
import Rover from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';

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
    const userIdParsed = new Types.ObjectId(userId);

    const rover = await this.roversRepository.create({
      name,
      userId: userIdParsed,
    });

    return rover;
  }
}
export default CreateRoverService;
