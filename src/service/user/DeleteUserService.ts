import AppError from '../../errors/AppError';
import UsersRepository from '../../repository/usersRepository';

interface Request {
  id: string;
}

class DeleteUserService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ id }: Request): Promise<void> {
    if (!id) {
      throw new AppError('Id is not sending o request!');
    }

    const response = await this.usersRepository.delete({ id });

    if (!response) {
      throw new AppError('Connection database error!');
    }

    if (response.matchedCount === 0) {
      throw new AppError('User not found!');
    }

    if (response.modifiedCount === 0) {
      throw new AppError('User not modified!');
    }
  }
}

export default DeleteUserService;
