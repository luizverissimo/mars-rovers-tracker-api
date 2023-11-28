import { Types } from 'mongoose';
import MissionsRepository from '../../repository/missionsRepository';
import LandsRepository from '../../repository/landsRepository';
import { IMission, IRoversMission } from '../../model/Mission';
import AppError from '../../errors/AppError';
import { ILand } from '../../model/Land';
import { SPIN_LEFT, SPIN_RIGHT, Orientation } from '../../constants';

interface RoverPathExecuted {
  roverId: Types.ObjectId;
  current_orientation: Orientation;
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
  private missionExecuted: MissionExecuted;

  constructor(
    missionsRepository: MissionsRepository,
    landsRepository: LandsRepository,
  ) {
    this.missionsRepository = missionsRepository;
    this.landsRepository = landsRepository;
    this.missionExecuted = {} as MissionExecuted;
  }

  public setMissionExecuted(missionExecuted: MissionExecuted) {
    this.missionExecuted = missionExecuted as MissionExecuted;
  }

  public getMissionExecuted(): MissionExecuted {
    return this.missionExecuted;
  }

  private verifyCollisions(
    current_possition_x: number,
    current_possition_y: number,
    lastsRoversPositions: RoverPathExecuted[],
  ) {
    lastsRoversPositions.forEach((lastRoverPosition: RoverPathExecuted) => {
      const coordinatesRover = `${current_possition_x},${current_possition_y}`;
      const coordinatesLastRover = `${lastRoverPosition.current_possition_x},${lastRoverPosition.current_possition_y}`;
      if (coordinatesRover === coordinatesLastRover) {
        throw new AppError('Rovers will collid!');
      }
    });
  }

  private verifyLandExceeds(
    land: ILand,
    current_possition_x: number,
    current_possition_y: number,
  ) {
    const exceedsx =
      current_possition_x > land.horizontalRange || current_possition_x < 0;
    const exceedsy =
      current_possition_y > land.verticalRange || current_possition_y < 0;

    if (exceedsx || exceedsy) {
      throw new AppError('The rover exceeds the limits of plateau.');
    }
  }

  private roverPathGenarator(
    land: ILand,
    rover: IRoversMission,
    lastsRoversPositions: RoverPathExecuted[],
  ): RoverPathExecuted {
    let current_orientation: Orientation = rover.intialPosition
      .orientation as Orientation;
    let current_possition_x: number = rover.intialPosition.x;
    let current_possition_y: number = rover.intialPosition.y;

    const commands = rover.pathCommands.split('');

    commands.forEach((command: string) => {
      switch (command) {
        case 'M':
          switch (current_orientation) {
            case 'N' as Orientation:
              current_possition_y += 1;
              break;
            case 'S' as Orientation:
              current_possition_y -= 1;
              break;
            case 'E' as Orientation:
              current_possition_x += 1;
              break;
            case 'W' as Orientation:
              current_possition_x -= 1;
              break;
          }
          break;
        case 'L':
          current_orientation = SPIN_LEFT[
            `${current_orientation}` as keyof typeof SPIN_LEFT
          ] as Orientation;
          break;
        case 'R':
          current_orientation = SPIN_RIGHT[
            `${current_orientation}` as keyof typeof SPIN_RIGHT
          ] as Orientation;
          break;
        default:
          break;
      }
      this.verifyLandExceeds(land, current_possition_x, current_possition_y);
      if (lastsRoversPositions) {
        this.verifyCollisions(
          current_possition_x,
          current_possition_y,
          lastsRoversPositions,
        );
      }
    });

    return {
      roverId: rover.roverId,
      current_orientation,
      current_possition_x,
      current_possition_y,
    };
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

    const missionPathsGenerated: RoverPathExecuted[] =
      [] as RoverPathExecuted[];

    mission?.roversMission.forEach(rover => {
      missionPathsGenerated.push(
        this.roverPathGenarator(
          land,
          rover,
          missionPathsGenerated,
        ) as RoverPathExecuted,
      );
    });

    const missionExecuted = {
      resultsMission: missionPathsGenerated,
    } as MissionExecuted;
    this.setMissionExecuted(missionExecuted);

    return this.getMissionExecuted();
  }
}

export default ExecuteMissionService;
