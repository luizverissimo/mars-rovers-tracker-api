import AppError from '../../errors/AppError';
import User from '../../model/User';
import UsersRepository from '../../repository/usersRepository';
import bcrypt from 'bcrypt';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public async execute({
    name,
    email,
    password,
  }: Request): Promise<User | undefined> {
    if (!name) throw new AppError('You must send user name!');
    if (!email) throw new AppError('You must send user email!');
    if (!password) throw new AppError('You must send user password!');

    const existsUser = await this.usersRepository.findOneByEmail({
      email,
    });

    if (existsUser) throw new AppError('O usuário já foi cadastrado!');

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hash,
    });

    return user;
  }
}

export default CreateUserService;
