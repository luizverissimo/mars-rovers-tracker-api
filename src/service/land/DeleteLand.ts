import { Document, Types } from 'mongoose';
import LandsRepository from '../../repository/landsRepository';
import { UpdateResult } from 'mongodb';

interface Request {
  id: string;
}

class DeleteLandService {
  private landsRepository: LandsRepository;

  constructor(landsRepository: LandsRepository) {
    this.landsRepository = landsRepository;
  }
  public async execute({ id }: Request): Promise<UpdateResult<Document<null>>> {
    const idParsed = new Types.ObjectId(id);
    const rover = await this.landsRepository.delete({
      id: idParsed,
    });

    return rover;
  }
}
export default DeleteLandService;
