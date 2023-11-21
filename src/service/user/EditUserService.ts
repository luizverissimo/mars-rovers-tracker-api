import { Types, FlattenMaps } from 'mongoose';
import UsersRepository from '../../repository/usersRepository';

interface IUser {
  name: string;
  email: string;
  password: string;
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
      throw new Error('Id is not sending o request!');
    }

    const response = await this.usersRepository.edit({ id, name, email });

    if (!response) {
      throw new Error('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new Error('User not found!');
    }

    if (response.modifiedCount === 0) {
      throw new Error('User not modified!');
    }

    const user = await this.usersRepository.listById({ id });

    return user;
  }
}

export default EditUserService;
