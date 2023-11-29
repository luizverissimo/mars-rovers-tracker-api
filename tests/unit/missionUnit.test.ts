import { Orientation } from '../../src/constants';
import { roverPathGenarator } from '../../src/service/mission/ExecuteMissionService';

describe('Mission Controller', () => {
  it('should return rover positions', () => {
    const { current_orientation, current_possition_y, current_possition_x } =
      roverPathGenarator({
        pathCommands: 'LMLMLMLMM',
        current_orientation: 'N' as Orientation,
        current_possition_x: 1,
        current_possition_y: 2,
        lastsRoversPositions: [],
        horizontalRange: 10,
        verticalRange: 10,
      });

    expect(current_orientation).toBe('N');
    expect(current_possition_x).toBe(1);
    expect(current_possition_y).toBe(3);
  });

  it('should return rover positions with last rover position', () => {
    const { current_orientation, current_possition_y, current_possition_x } =
      roverPathGenarator({
        pathCommands: 'MRRMMRMRRM',
        current_orientation: 'E' as Orientation,
        current_possition_x: 3,
        current_possition_y: 3,
        lastsRoversPositions: [
          {
            current_orientation: 'N' as Orientation,
            current_possition_x: 1,
            current_possition_y: 3,
          },
        ],
        horizontalRange: 10,
        verticalRange: 10,
      });

    expect(current_orientation).toBe('S');
    expect(current_possition_x).toBe(2);
    expect(current_possition_y).toBe(3);
  });
});
