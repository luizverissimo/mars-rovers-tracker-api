import { Types } from 'mongoose';

export interface Orientation {
  N?: string;
  S?: string;
  E?: string;
  W?: string;
}

export interface IId {
  id: Types.ObjectId;
}

export interface IIdUserName {
  userId: Types.ObjectId;
  name: string;
}

const SPIN_LEFT: Orientation = { N: 'W', S: 'E', E: 'N', W: 'S' };
const SPIN_RIGHT: Orientation = { N: 'E', S: 'W', E: 'S', W: 'N' };

export { SPIN_LEFT, SPIN_RIGHT };
