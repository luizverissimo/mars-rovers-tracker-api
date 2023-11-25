import { Document, Types } from 'mongoose';
import RoversRepository from '../../repository/roversRepository';
import { UpdateResult } from 'mongodb';

interface Request {
  id: string;
}

class DeleteRoverService {
  private roversRepository: RoversRepository;

  constructor(roversRepository: RoversRepository) {
    this.roversRepository = roversRepository;
  }
  public async execute({ id }: Request): Promise<UpdateResult<Document<null>>> {
    const idParsed = new Types.ObjectId(id);
    const rover = await this.roversRepository.delete({
      id: idParsed,
    });

    return rover;
  }
}
export default DeleteRoverService;
