import { Types } from 'mongoose';
import MissionsRepository from '../../repository/missionsRepository';
import LandsRepository from '../../repository/landsRepository';
import { IMission, IRoversMission } from '../../model/Mission';
import AppError from '../../errors/AppError';
import { ILand } from '../../model/Land';

interface RoverPathExecuted {
  roverId: Types.ObjectId;
  current_orientation: string;
  current_possition_x: number;
  current_possition_y: number;
}

interface MissionExecuted {
  resultsMission: RoverPathExecuted[];
}

interface Request {
  id: string;
}

class ExecuteMissionService {
  private missionsRepository: MissionsRepository;
  private landsRepository: LandsRepository;

  private verifyPathIssues(
    land: ILand,
    current_possition_x: number,
    current_possition_y: number,
  ) {
    const exceedsx = current_possition_x > land.horizontalRange;
    const exceedsy = current_possition_y > land.verticalRange;

    if (exceedsx || exceedsy) {
      throw new AppError('The rover exceeds the limits of plateau.');
    }
  }

  private roverPathGenarator(land: ILand, rover: IRoversMission) {
    let current_orientation = rover.intialPosition.orientation;
    let current_possition_x: number = rover.intialPosition.x;
    let current_possition_y: number = rover.intialPosition.y;

    const commands = rover.pathCommands.split('');

    commands.forEach((command: string) => {
      switch (command) {
        case 'M':
          switch (current_orientation) {
            case 'N':
              current_possition_y += 1;
              break;
            case 'S':
              current_possition_y -= 1;
              break;
            case 'E':
              current_possition_x += 1;
              break;
            case 'W':
              current_possition_x -= 1;
              break;
          }
          break;
        case 'L':
          switch (current_orientation) {
            case 'N':
              current_orientation = 'W';
              break;
            case 'S':
              current_orientation = 'E';
              break;
            case 'E':
              current_orientation = 'N';
              break;
            case 'W':
              current_orientation = 'S';
              break;
          }
          break;
        case 'R':
          switch (current_orientation) {
            case 'N':
              current_orientation = 'E';
              break;
            case 'S':
              current_orientation = 'W';
              break;
            case 'E':
              current_orientation = 'S';
              break;
            case 'W':
              current_orientation = 'N';
              break;
          }
          break;
        default:
          break;
      }
      this.verifyPathIssues(land, current_possition_x, current_possition_y);
    });
    return {
      roverId: rover.roverId,
      current_orientation,
      current_possition_x,
      current_possition_y,
    };
  }

  constructor(
    missionsRepository: MissionsRepository,
    landsRepository: LandsRepository,
  ) {
    this.missionsRepository = missionsRepository;
    this.landsRepository = landsRepository;
  }
  public async execute({ id }: Request): Promise<MissionExecuted> {
    const idParsed = new Types.ObjectId(id);

    const mission: IMission | null = await this.missionsRepository.listById({
      id: idParsed,
    });

    if (!mission) {
      throw new AppError('Mission not found!');
    }

    const landIdParsed = new Types.ObjectId(mission?.landId);

    const land: ILand | null = await this.landsRepository.listById({
      id: landIdParsed,
    });

    if (!land) {
      throw new AppError('Land not found!');
    }

    const missionExecuted = {
      resultsMission: [],
    } as MissionExecuted;

    mission?.roversMission.forEach(rover => {
      missionExecuted.resultsMission.push(this.roverPathGenarator(land, rover));
    });

    return missionExecuted;
  }
}

export default ExecuteMissionService;
