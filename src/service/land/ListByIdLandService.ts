import { Document, Types } from 'mongoose';
import { ILand } from '../../model/Land';
import LandsRepository from '../../repository/landsRepository';
import AppError from '../../errors/AppError';

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
    if (!id) throw new AppError('You must send land id!');

    const idParsed = new Types.ObjectId(id);
    const land = await this.landsRepository.listById({
      id: idParsed,
    });

    return land;
  }
}
export default ListByIdLandService;
