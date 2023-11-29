import { Types } from 'mongoose';
import Rover from '../../model/Rover';
import LandsRepository from '../../repository/landsRepository';
import AppError from '../../errors/AppError';
import UsersRepository from '../../repository/usersRepository';

interface Request {
  name: string;
  horizontalRange: number;
  verticalRange: number;
  userId: string;
}

class CreateLandService {
  private landsRepository: LandsRepository;
  private usersRepository: UsersRepository;

  constructor() {
    this.landsRepository = new LandsRepository();
    this.usersRepository = new UsersRepository();
  }
  public async execute({
    name,
    horizontalRange,
    verticalRange,
    userId,
  }: Request): Promise<Rover | undefined> {
    if (!name) throw new AppError('You must send land name!');

    if (!horizontalRange)
      throw new AppError('You must send land horizontalRange!');

    if (!verticalRange) throw new AppError('You must send land verticalRange!');

    if (!userId) throw new AppError('You must send land user id!');

    const userIdParsed = new Types.ObjectId(userId);

    const userExists = await this.usersRepository.listById({
      id: userIdParsed,
    });

    if (!userExists) throw new AppError('User not found!');

    const landExists = await this.landsRepository.listByName({
      name,
      userId: userIdParsed,
    });

    if (landExists) throw new AppError('This land already exists!');

    const land = await this.landsRepository.create({
      name,
      horizontalRange,
      verticalRange,
      userId: userIdParsed,
    });

    return land;
  }
}
export default CreateLandService;
