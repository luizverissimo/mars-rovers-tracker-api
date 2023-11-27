export interface Orientation {
  N?: string;
  S?: string;
  E?: string;
  W?: string;
}

const SPIN_LEFT: Orientation = { N: 'W', S: 'E', E: 'N', W: 'S' };
const SPIN_RIGHT: Orientation = { N: 'E', S: 'W', E: 'S', W: 'N' };

export { SPIN_LEFT, SPIN_RIGHT };
