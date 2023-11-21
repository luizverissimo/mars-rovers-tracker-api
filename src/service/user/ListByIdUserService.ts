import { Types, FlattenMaps } from 'mongoose';
import UsersRepository from '../../repository/usersRepository';

interface IUser {
  name: string;
  email: string;
  password: string;
}

class ListUserByIdService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(
    id: string | undefined,
  ): Promise<FlattenMaps<IUser & { _id: Types.ObjectId }> | null | undefined> {
    if (!id) {
      throw new Error('Id is not sending o request!');
    }

    const user = await this.usersRepository.listById({ id });

    return user;
  }
}

export default ListUserByIdService;
