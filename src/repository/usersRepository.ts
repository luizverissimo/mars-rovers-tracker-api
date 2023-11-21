import { FlattenMaps, Types, UpdateWriteOpResult } from 'mongoose';
import User from '../model/User';
interface IEmail {
  email: string;
}

interface IId {
  id: string;
}
interface IUser {
  name: string;
  email: string;
  password: string;
}

interface IUserEdit {
  id: string;
  name: string;
  email: string;
}

class UsersRepository {
  public async findOneByEmail({
    email,
  }: IEmail): Promise<FlattenMaps<IUser & { _id: Types.ObjectId }> | null> {
    const userModel = User.getModel();
    const user = await userModel.findOne({ email, removed: false }).lean();
    return user;
  }

  public async create({
    name,
    email,
    password,
  }: IUser): Promise<User | undefined> {
    try {
      const user = new User({ name, email, password });
      await user.newModel().save();
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  public async listById({
    id,
  }: IId): Promise<
    FlattenMaps<IUser & { _id: Types.ObjectId }> | null | undefined
  > {
    try {
      const user = await User.getModel()
        .findOne({
          _id: new Types.ObjectId(id),
          removed: false,
        })
        .lean();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  public async edit({
    id,
    name,
    email,
  }: IUserEdit): Promise<UpdateWriteOpResult | null | undefined> {
    try {
      const updatedAt = new Date();
      const response = await User.getModel()
        .updateOne(
          {
            _id: new Types.ObjectId(id),
          },
          {
            $set: {
              name,
              email,
              updatedAt,
            },
          },
        )
        .lean();

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  public async delete({
    id,
  }: IId): Promise<UpdateWriteOpResult | null | undefined> {
    try {
      const updatedAt = new Date();
      const response = await User.getModel()
        .updateOne(
          {
            _id: new Types.ObjectId(id),
          },
          {
            $set: {
              removed: true,
              updatedAt,
            },
          },
        )
        .lean();

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UsersRepository;
