import { Document, Schema, Types } from 'mongoose';
import Rover from '../../model/Rover';
import RoversRepository from '../../repository/roversRepository';
import AppError from '../../errors/AppError';
import { UpdateResult } from 'mongodb';

interface Request {
  id: string;
}

class DeleteRoverService {
  private roversRepository: RoversRepository;

  constructor(roversRepository: RoversRepository) {
    this.roversRepository = roversRepository;
  }
  public async execute({ id }: Request): Promise<UpdateResult<Document<null>>> {
    const rover = await this.roversRepository.delete({
      id,
    });

    return rover;
  }
}
export default DeleteRoverService;
