import { Document, Types } from 'mongoose';
import MissionRepository from '../../repository/missionsRepository';
import { IMission } from '../../model/Mission';

interface Request {
  id: string;
}

class ListByIdMissionsService {
  private missionsRepository: MissionRepository;

  constructor() {
    this.missionsRepository = new MissionRepository();
  }
  public async execute({
    id,
  }: Request): Promise<
    (Document<unknown, IMission> & IMission & { _id: Types.ObjectId }) | null
  > {
    const idParsed = new Types.ObjectId(id);
    const mission = await this.missionsRepository.listById({
      id: idParsed,
    });

    return mission;
  }
}
export default ListByIdMissionsService;
