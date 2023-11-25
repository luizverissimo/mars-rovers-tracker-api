import { Document, Types } from 'mongoose';
import { ILand } from '../../model/Land';
import LandsRepository from '../../repository/landsRepository';

interface Request {
  id: string;
}

class ListByIdLandService {
  private landsRepository: LandsRepository;

  constructor(landsRepository: LandsRepository) {
    this.landsRepository = landsRepository;
  }
  public async execute({
    id,
  }: Request): Promise<
    (Document<unknown, ILand> & ILand & { _id: Types.ObjectId }) | null
  > {
    const idParsed = new Types.ObjectId(id);
    const rover = await this.landsRepository.listById({
      id: idParsed,
    });

    return rover;
  }
}
export default ListByIdLandService;
