export function createMissionSuccessfully(
  landId: string | undefined,
  userId: string | undefined,
  rover1Id: string | undefined,
  rover2Id: string | undefined,
) {
  return {
    name: 'mission 1',
    roversMission: [
      {
        roverId: rover1Id,
        pathCommands: 'LMLMLMLMM',
        intialPosition: {
          x: 1,
          y: 2,
          orientation: 'N',
        },
      },
      {
        roverId: rover2Id,
        pathCommands: 'MRRMMRMRRM',
        intialPosition: {
          x: 3,
          y: 3,
          orientation: 'E',
        },
      },
    ],
    landId: landId,
    userId: userId,
  };
}

export function createMissionExceedsLand(
  landId: string | undefined,
  userId: string | undefined,
  rover1Id: string | undefined,
) {
  return {
    name: 'mission 2',
    roversMission: [
      {
        roverId: rover1Id,
        pathCommands: 'MMMLLMR',
        intialPosition: {
          x: 9,
          y: 9,
          orientation: 'N',
        },
      },
    ],
    landId: landId,
    userId: userId,
  };
}

export function createMissionColission(
  landId: string | undefined,
  userId: string | undefined,
  rover1Id: string | undefined,
  rover2Id: string | undefined,
) {
  return {
    name: 'mission 3',
    roversMission: [
      {
        roverId: rover1Id,
        pathCommands: 'MMMLLMR',
        intialPosition: {
          x: 1,
          y: 3,
          orientation: 'N',
        },
      },
      {
        roverId: rover2Id,
        pathCommands: 'MMMRMLMM',
        intialPosition: {
          x: 0,
          y: 0,
          orientation: 'N',
        },
      },
    ],
    landId: landId,
    userId: userId,
  };
}
