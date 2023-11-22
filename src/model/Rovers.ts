import { Schema, model } from 'mongoose';

interface IRover {
  name: string;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const roverSchema = new Schema<IRover>({
  name: { type: String, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const roverModel = model<IRover>('Rover', roverSchema);

class Rover {
  name: string;

  constructor({ name }: IRover) {
    this.name = name;
  }

  public static getModel() {
    return roverModel;
  }
  public newModel() {
    return new roverModel({
      name: this.name,
    });
  }
}
export default Rover;
