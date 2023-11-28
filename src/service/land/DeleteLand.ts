import { Document, Types } from 'mongoose';
import LandsRepository from '../../repository/landsRepository';
import { UpdateResult } from 'mongodb';
import AppError from '../../errors/AppError';

interface Request {
  id: string;
}

class DeleteLandService {
  private landsRepository: LandsRepository;

  constructor(landsRepository: LandsRepository) {
    this.landsRepository = landsRepository;
  }
  public async execute({ id }: Request): Promise<UpdateResult<Document<null>>> {
    if (!id) new AppError('You must send land id!');

    const idParsed = new Types.ObjectId(id);
    const response = await this.landsRepository.delete({
      id: idParsed,
    });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('Land not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('Land not deleted!');
    }

    return response;
  }
}
export default DeleteLandService;
