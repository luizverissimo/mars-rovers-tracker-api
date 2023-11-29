import { Document, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import MissionsRepository from '../../repository/missionsRepository';
import { IMission, IRoversMission } from '../../model/Mission';

interface Request {
  id: string;
  name: string;
  roversMission: IRoversMission[];
  landId: string;
}

class EditMissionService {
  private missionsRepository: MissionsRepository;

  constructor() {
    this.missionsRepository = new MissionsRepository();
  }
  public async execute({
    id,
    name,
    roversMission,
    landId,
  }: Request): Promise<
    (Document<unknown, IMission> & IMission & { _id: Types.ObjectId }) | null
  > {
    const idParsed = new Types.ObjectId(id);
    const landIdParsed = new Types.ObjectId(landId);

    const response = await this.missionsRepository.edit({
      id: idParsed,
      name,
      roversMission,
      landId: landIdParsed,
    });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('User not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('User not modified!');
    }

    const mission = await this.missionsRepository.listById({ id: idParsed });

    return mission;
  }
}
export default EditMissionService;
