import { Document, Types } from 'mongoose';
import { IRover } from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';
import AppError from '../../errors/AppError';

interface Request {
  id: string;
}

class ListByIdRoverService {
  private roversRepository: RoversRepository;

  constructor(roversRepository: RoversRepository) {
    this.roversRepository = roversRepository;
  }
  public async execute({
    id,
  }: Request): Promise<
    (Document<unknown, IRover> & IRover & { _id: Types.ObjectId }) | null
  > {
    if (!id) new AppError('You must send rover id!');

    const idParsed = new Types.ObjectId(id);
    const rover = await this.roversRepository.listById({
      id: idParsed,
    });

    return rover;
  }
}
export default ListByIdRoverService;
