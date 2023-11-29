import { Schema, Types } from 'mongoose';
import Rover from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';
import AppError from '../../errors/AppError';
import UsersRepository from '../../repository/usersRepository';

interface Request {
  name: string;
  userId: string;
}

class CreateRoverService {
  private roversRepository: RoversRepository;
  private usersRepository: UsersRepository;

  constructor() {
    this.roversRepository = new RoversRepository();
    this.usersRepository = new UsersRepository();
  }
  public async execute({ name, userId }: Request): Promise<Rover | undefined> {
    if (!name) throw new AppError('You must send rover name!');

    if (!userId) throw new AppError('You must send user id!');

    const userIdParsed = new Types.ObjectId(userId);

    const userExists = await this.usersRepository.listById({
      id: userIdParsed,
    });

    if (!userExists) throw new AppError('User not found!');

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
