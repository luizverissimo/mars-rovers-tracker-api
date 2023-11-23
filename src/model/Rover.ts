import { Schema, Types, model } from 'mongoose';

interface IRover {
  name: string;
  userId: Types.ObjectId;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const roverSchema = new Schema<IRover>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const roverModel = model<IRover>('Rover', roverSchema);

class Rover {
  name: string;

  userId: Types.ObjectId;

  constructor({ name, userId }: IRover) {
    this.name = name;
    this.userId = userId;
  }

  public static getModel() {
    return roverModel;
  }
  public newModel() {
    return new roverModel({
      name: this.name,
      userId: this.userId,
    });
  }
}
export default Rover;
