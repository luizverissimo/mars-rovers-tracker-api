import { Document, Types } from 'mongoose';
import { UpdateResult } from 'mongodb';
import MissionsRepository from '../../repository/missionsRepository';

interface Request {
  id: string;
}

class DeleteMissiondService {
  private missionsRepository: MissionsRepository;

  constructor(missionsRepository: MissionsRepository) {
    this.missionsRepository = missionsRepository;
  }
  public async execute({ id }: Request): Promise<UpdateResult<Document<null>>> {
    const idParsed = new Types.ObjectId(id);
    const mission = await this.missionsRepository.delete({
      id: idParsed,
    });

    return mission;
  }
}
export default DeleteMissiondService;
