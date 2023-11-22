import { Schema, model } from 'mongoose';

interface IMission {
  name: string;
  roversIds: object;
  landId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const missionSchema = new Schema<IMission>({
  name: { type: String, required: true },
  roversIds: { type: [Schema.Types.ObjectId], required: true, default: false },
  landId: { type: Schema.Types.ObjectId, required: true, default: false },
  userId: { type: Schema.Types.ObjectId, required: true, default: false },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const missionModel = model<IMission>('Mission', missionSchema);

class Mission {
  name: string;

  roversIds: object;

  landId: Schema.Types.ObjectId;

  userId: Schema.Types.ObjectId;

  constructor({ name, roversIds, landId, userId }: IMission) {
    this.name = name;
    this.roversIds = roversIds;
    this.landId = landId;
    this.userId = userId;
  }

  public static getModel() {
    return missionModel;
  }
  public newModel() {
    return new missionModel({
      name: this.name,
      roversIds: this.roversIds,
      landId: this.landId,
      userId: this.userId,
    });
  }
}
export default Mission;
