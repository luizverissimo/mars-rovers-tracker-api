export function createMissionSuccessfully(
  landId: string | undefined,
  userId: string | undefined,
) {
  return {
    name: 'mission 1',
    roversMission: [
      {
        roverId: '655e4c3f6ef0e532b8281f04',
        pathCommands: 'LMLMLMLMM',
        intialPosition: {
          x: 1,
          y: 2,
          orientation: 'N',
        },
      },
      {
        roverId: '655e4c9730aa66b57d0b2fe0',
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
) {
  return {
    name: 'mission 2',
    roversMission: [
      {
        roverId: '655e4c3f6ef0e532b8281f04',
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
) {
  return {
    name: 'mission 3',
    roversMission: [
      {
        roverId: '655e4c3f6ef0e532b8281f04',
        pathCommands: 'MMMLLMR',
        intialPosition: {
          x: 1,
          y: 3,
          orientation: 'N',
        },
      },
      {
        roverId: '655e4c3f6ef0e532b8281f04',
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
