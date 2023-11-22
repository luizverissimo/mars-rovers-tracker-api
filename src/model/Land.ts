import { Schema, model } from 'mongoose';

interface ILand {
  name: string;
  horizontalRange: number;
  verticalRange: number;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const landSchema = new Schema<ILand>({
  name: { type: String, required: true },
  horizontalRange: { type: Number, horizontalRange: true },
  verticalRange: { type: Number, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const landModel = model<ILand>('Land', landSchema);

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
