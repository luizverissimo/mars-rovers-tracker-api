import { Schema, model } from 'mongoose';

interface IInstruction {
  pathCommands: string;
  rover: Schema.Types.ObjectId;
  mission: Schema.Types.ObjectId;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const instructionSchema = new Schema<IInstruction>({
  pathCommands: { type: String, required: true },
  rover: { type: Schema.Types.ObjectId, required: true },
  mission: { type: Schema.Types.ObjectId, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const instructionModel = model<IInstruction>('Instruction', instructionSchema);

class Instruction {
  pathCommands: string;

  rover: Schema.Types.ObjectId;

  mission: Schema.Types.ObjectId;

  constructor({ pathCommands, rover, mission }: IInstruction) {
    this.pathCommands = pathCommands;
    this.rover = rover;
    this.mission = mission;
  }

  public static getModel() {
    return instructionModel;
  }
  public newModel() {
    return new instructionModel({
      pathCommands: this.pathCommands,
      rover: this.rover,
      mission: this.mission,
    });
  }
}
export default Instruction;
