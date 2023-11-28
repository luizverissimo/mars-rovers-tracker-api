import { Types, FlattenMaps } from 'mongoose';
import UsersRepository from '../../repository/usersRepository';
import AppError from '../../errors/AppError';

interface IUser {
  name: string;
  email: string;
  password?: string;
}

interface Request {
  id: string;
  name: string;
  email: string;
}

class EditUserService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({
    id,
    name,
    email,
  }: Request): Promise<
    FlattenMaps<IUser & { _id: Types.ObjectId }> | null | undefined
  > {
    if (!id) {
      throw new AppError('Id is not sending o request!');
    }

    const response = await this.usersRepository.edit({ id, name, email });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('User not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('User not modified!');
    }

    const idParsed = new Types.ObjectId(id);

    const user = await this.usersRepository.listById({ id: idParsed });

    return user;
  }
}

export default EditUserService;
