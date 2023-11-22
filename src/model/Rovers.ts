import { Schema, model } from 'mongoose';

interface IRover {
  name: string;
}

const roverSchema = new Schema<IRover>({
  name: { type: String, required: true },
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
