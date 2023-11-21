import bcrypt from 'bcrypt';
import UsersRepository from '../../repository/usersRepository';
import jwt from 'jsonwebtoken';

interface Request {
  email: string;
  password: string;
}
class AuthenticateUserService {
  private usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ email, password }: Request): Promise<string | null> {
    const { JWT_SECRET } = process.env;

    if (!JWT_SECRET) {
      throw new Error('O segredo do JWT não foi atribuido no ambiente!');
    }

    const user = await this.usersRepository.findOneByEmail({ email });

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      throw new Error('A senha está incorreta!');
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
