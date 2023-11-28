import { Schema, Types, model } from 'mongoose';

export interface IRoversMission {
  roverId: Types.ObjectId;
  pathCommands: string;
  intialPosition: {
    x: number;
    y: number;
    orientation: string;
  };
}

export interface IMission {
  _id?: Types.ObjectId;
  name: string;
  roversMission: IRoversMission[];
  landId: Types.ObjectId;
  userId: Types.ObjectId;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const missionSchema = new Schema<IMission>({
  name: { type: String, required: true },
  roversMission: { type: [Object], required: true },
  landId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const missionModel = model<IMission>('Mission', missionSchema);

class Mission {
  name: string;

  roversMission: IRoversMission[];

  landId: Types.ObjectId;

  userId: Types.ObjectId;

  constructor({ name, roversMission, landId, userId }: IMission) {
    this.name = name;
    this.roversMission = roversMission;
    this.landId = landId;
    this.userId = userId;
  }

  public static getModel() {
    return missionModel;
  }
  public newModel() {
    return new missionModel({
      name: this.name,
      roversMission: this.roversMission,
      landId: this.landId,
      userId: this.userId,
    });
  }
}
export default Mission;
