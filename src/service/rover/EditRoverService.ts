import { Document, Schema, Types } from 'mongoose';
import Rover, { IRover } from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';
import AppError from '../../errors/AppError';
import { UpdateResult } from 'mongodb';

interface Request {
  id: string;
  name: string;
}

class EditRoverService {
  private roversRepository: RoversRepository;

  constructor(roversRepository: RoversRepository) {
    this.roversRepository = roversRepository;
  }
  public async execute({
    id,
    name,
  }: Request): Promise<
    (Document<unknown, IRover> & IRover & { _id: Types.ObjectId }) | null
  > {
    const idParsed = new Types.ObjectId(id);

    const response = await this.roversRepository.edit({
      name,
      id: idParsed,
    });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('User not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('User not modified!');
    }

    const rover = await this.roversRepository.listById({ id });

    return rover;
  }
}
export default EditRoverService;
