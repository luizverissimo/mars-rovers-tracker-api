import { Types } from 'mongoose';
import Rover from '../../model/Rover';
import LandsRepository from '../../repository/landsRepository';

interface Request {
  name: string;
  horizontalRange: number;
  verticalRange: number;
  userId: string;
}

class CreateLandService {
  private landsRepository: LandsRepository;

  constructor(landsRepository: LandsRepository) {
    this.landsRepository = landsRepository;
  }
  public async execute({
    name,
    horizontalRange,
    verticalRange,
    userId,
  }: Request): Promise<Rover | undefined> {
    const userIdParsed = new Types.ObjectId(userId);

    const land = await this.landsRepository.create({
      name,
      horizontalRange,
      verticalRange,
      userId: userIdParsed,
    });

    return land;
  }
}
export default CreateLandService;
