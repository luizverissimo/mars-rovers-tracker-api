import { Document, Types } from 'mongoose';
import { IRover } from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';
import AppError from '../../errors/AppError';

interface Request {
  id: string;
  name: string;
}

class EditRoverService {
  private roversRepository: RoversRepository;

  constructor() {
    this.roversRepository = new RoversRepository();
  }
  public async execute({
    id,
    name,
  }: Request): Promise<
    (Document<unknown, IRover> & IRover & { _id: Types.ObjectId }) | null
  > {
    if (!id) throw new AppError('You must send rover id!');

    if (!name) throw new AppError('You must send rover name!');

    const idParsed = new Types.ObjectId(id);

    const response = await this.roversRepository.edit({
      name,
      id: idParsed,
    });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('Rover not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('Rover not modified!');
    }

    const rover = await this.roversRepository.listById({ id: idParsed });

    return rover;
  }
}
export default EditRoverService;
