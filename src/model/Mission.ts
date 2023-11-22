import { Schema, model } from 'mongoose';

interface IMission {
  name: string;
  rovers: object;
  land: Schema.Types.ObjectId;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const missionSchema = new Schema<IMission>({
  name: { type: String, required: true },
  rovers: { type: [Schema.Types.ObjectId], required: true, default: false },
  land: { type: Schema.Types.ObjectId, required: true, default: false },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const missionModel = model<IMission>('Mission', missionSchema);

class Mission {
  name: string;

  rovers: object;

  land: Schema.Types.ObjectId;

  constructor({ name, rovers, land }: IMission) {
    this.name = name;
    this.rovers = rovers;
    this.land = land;
  }

  public static getModel() {
    return missionModel;
  }
  public newModel() {
    return new missionModel({
      name: this.name,
      rovers: this.rovers,
      land: this.land,
    });
  }
}
export default Mission;
