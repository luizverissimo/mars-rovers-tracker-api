import { Schema, model } from 'mongoose';

interface ILand {
  name: string;
  horizontalRange: number;
  verticalRange: number;
}

const landSchema = new Schema<ILand>({
  name: { type: String, required: true },
  horizontalRange: { type: Number, horizontalRange: true },
  verticalRange: { type: Number, required: true },
});

const landModel = model<ILand>('land', landSchema);

class Land {
  name: string;

  horizontalRange: number;

  verticalRange: number;

  constructor({ name, horizontalRange, verticalRange }: ILand) {
    this.name = name;
    this.horizontalRange = horizontalRange;
    this.verticalRange = verticalRange;
  }

  public static getModel() {
    return landModel;
  }
  public newModel() {
    return new landModel({
      name: this.name,
      horizontalRange: this.horizontalRange,
      verticalRange: this.verticalRange,
    });
  }
}
export default Land;
