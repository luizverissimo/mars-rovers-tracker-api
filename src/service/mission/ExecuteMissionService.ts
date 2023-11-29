import { Types } from 'mongoose';
import MissionsRepository from '../../repository/missionsRepository';
import LandsRepository from '../../repository/landsRepository';
import { IMission, IRoversMission } from '../../model/Mission';
import AppError from '../../errors/AppError';
import { ILand } from '../../model/Land';
import { SPIN_LEFT, SPIN_RIGHT, Orientation } from '../../constants';

interface IRoverPathGenarator {
  pathCommands: string;
  current_orientation: Orientation;
  current_possition_y: number;
  current_possition_x: number;
  lastsRoversPositions: RoverPathExecuted[];
  horizontalRange: number;
  verticalRange: number;
}

interface RoverPathExecuted {
  roverId?: Types.ObjectId;
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

export function verifyCollisions(
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

export function verifyLandExceeds(
  horizontalRange: number,
  verticalRange: number,
  current_possition_x: number,
  current_possition_y: number,
) {
  const exceedsx =
    current_possition_x > horizontalRange || current_possition_x < 0;
  const exceedsy =
    current_possition_y > verticalRange || current_possition_y < 0;

  if (exceedsx || exceedsy) {
    throw new AppError('The rover exceeds the limits of plateau.');
  }
}

export function roverPathGenarator({
  pathCommands,
  current_orientation,
  current_possition_y,
  current_possition_x,
  lastsRoversPositions,
  horizontalRange,
  verticalRange,
}: IRoverPathGenarator) {
  const commands = pathCommands.split('');

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
    verifyLandExceeds(
      horizontalRange,
      verticalRange,
      current_possition_x,
      current_possition_y,
    );
    verifyCollisions(
      current_possition_x,
      current_possition_y,
      lastsRoversPositions,
    );
  });

  return { current_orientation, current_possition_y, current_possition_x };
}

class ExecuteMissionService {
  private missionsRepository: MissionsRepository;
  private missionExecuted: MissionExecuted;

  constructor() {
    this.missionsRepository = new MissionsRepository();
    this.missionExecuted = {} as MissionExecuted;
  }

  public setMissionExecuted(missionExecuted: MissionExecuted) {
    this.missionExecuted = missionExecuted as MissionExecuted;
  }

  public getMissionExecuted(): MissionExecuted {
    return this.missionExecuted;
  }

  private sendRoverPathGenarator(
    roverId: Types.ObjectId,
    horizontalRange: number,
    verticalRange: number,
    initial_orientation: Orientation,
    initial_possition_x: number,
    initial_possition_y: number,
    pathCommands: string,
    lastsRoversPositions: RoverPathExecuted[],
  ): RoverPathExecuted {
    const { current_orientation, current_possition_y, current_possition_x } =
      roverPathGenarator({
        pathCommands,
        current_orientation: initial_orientation,
        current_possition_x: initial_possition_x,
        current_possition_y: initial_possition_y,
        lastsRoversPositions,
        horizontalRange,
        verticalRange,
      });

    return {
      roverId,
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

    const landsRepository = new LandsRepository();
    const land: ILand | null = await landsRepository.listById({
      id: landIdParsed,
    });

    if (!land) {
      throw new AppError('Land not found!');
    }

    const missionPathsGenerated: RoverPathExecuted[] =
      [] as RoverPathExecuted[];

    mission?.roversMission.forEach(rover => {
      missionPathsGenerated.push(
        this.sendRoverPathGenarator(
          rover.roverId,
          land.horizontalRange,
          land.verticalRange,
          rover.intialPosition.orientation as Orientation,
          rover.intialPosition.x,
          rover.intialPosition.y,
          rover.pathCommands,
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
