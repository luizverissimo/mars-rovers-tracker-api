import { Document, Types } from 'mongoose';
import { ILand } from '../../model/Land';
import LandRepository from '../../repository/landsRepository';
import AppError from '../../errors/AppError';

interface Request {
  id: string;
  horizontalRange: number;
  verticalRange: number;
  name: string;
}

class EditLandService {
  private landRepository: LandRepository;

  constructor() {
    this.landRepository = new LandRepository();
  }
  public async execute({
    id,
    name,
    horizontalRange,
    verticalRange,
  }: Request): Promise<
    (Document<unknown, ILand> & ILand & { _id: Types.ObjectId }) | null
  > {
    if (!id) throw new AppError('You must send land id!');

    if (!name && !horizontalRange && !verticalRange)
      throw new AppError(
        'You must send land name, horizontal or vertical range!',
      );

    const idParsed = new Types.ObjectId(id);

    const response = await this.landRepository.edit({
      name,
      horizontalRange,
      verticalRange,
      id: idParsed,
    });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('Land not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('Land not modified!');
    }

    const land = await this.landRepository.listById({ id: idParsed });

    return land;
  }
}
export default EditLandService;
