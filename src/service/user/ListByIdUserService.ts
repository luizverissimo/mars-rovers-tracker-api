import { Types, FlattenMaps } from 'mongoose';
import UsersRepository from '../../repository/usersRepository';
import AppError from '../../errors/AppError';
import { ObjectId } from 'mongodb';

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
    id: string,
  ): Promise<FlattenMaps<IUser & { _id: Types.ObjectId }> | null | undefined> {
    if (!id) throw new AppError('You must send user id!');

    const idParsed = new Types.ObjectId(id);

    const user = await this.usersRepository.listById({ id: idParsed });

    if (!user) throw new AppError('User not found!');

    return user;
  }
}

export default ListUserByIdService;
