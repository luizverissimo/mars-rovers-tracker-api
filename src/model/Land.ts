import { Schema, Types, model } from 'mongoose';

export interface ILand {
  name: string;
  horizontalRange: number;
  verticalRange: number;
  userId: Types.ObjectId;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const landSchema = new Schema<ILand>({
  name: { type: String, required: true },
  horizontalRange: { type: Number, required: true },
  verticalRange: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const landModel = model<ILand>('Land', landSchema);

class Land {
  name: string;

  horizontalRange: number;

  verticalRange: number;

  userId: Types.ObjectId;

  constructor({ name, horizontalRange, verticalRange, userId }: ILand) {
    this.name = name;
    this.horizontalRange = horizontalRange;
    this.verticalRange = verticalRange;
    this.userId = userId;
  }

  public static getModel() {
    return landModel;
  }
  public newModel() {
    return new landModel({
      name: this.name,
      horizontalRange: this.horizontalRange,
      verticalRange: this.verticalRange,
      userId: this.userId,
    });
  }
}
export default Land;
