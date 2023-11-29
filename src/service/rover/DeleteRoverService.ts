import { Document, Types } from 'mongoose';
import RoversRepository from '../../repository/roversRepository';
import { UpdateResult } from 'mongodb';
import AppError from '../../errors/AppError';

interface Request {
  id: string;
}

class DeleteRoverService {
  private roversRepository: RoversRepository;

  constructor() {
    this.roversRepository = new RoversRepository();
  }
  public async execute({ id }: Request): Promise<UpdateResult<Document<null>>> {
    if (!id) throw new AppError('You must send rover id!');

    const idParsed = new Types.ObjectId(id);

    const response = await this.roversRepository.delete({
      id: idParsed,
    });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('Rover not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('Rover not deleted!');
    }

    return response;
  }
}
export default DeleteRoverService;
