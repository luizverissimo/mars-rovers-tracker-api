import bcrypt from 'bcrypt';
import UsersRepository from '../../repository/usersRepository';
import jwt from 'jsonwebtoken';
import AppError from '../../errors/AppError';

interface Request {
  email: string;
  password: string;
}
class AuthenticateUserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public async execute({ email, password }: Request): Promise<string | null> {
    if (!email) throw new AppError('You must send user email!');

    if (!password) throw new AppError('You must send user password!');

    const { JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
      throw new AppError('O segredo do JWT não foi atribuido no ambiente!');
    }

    const user = await this.usersRepository.findOneByEmail({ email });

    if (!user) {
      throw new AppError('Usuário não encontrado!');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      throw new AppError('A senha está incorreta!');
    }
    const { _id, name, email: emailUser } = user;
    const payload = { id: _id, name, email: emailUser };
    const token = await jwt.sign(payload, JWT_SECRET, {
      expiresIn: 3600,
    });
    return token;
  }
}

export default AuthenticateUserService;
