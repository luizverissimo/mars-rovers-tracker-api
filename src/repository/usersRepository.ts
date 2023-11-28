import { FlattenMaps, Types, UpdateWriteOpResult } from 'mongoose';
import User from '../model/User';
import { IId } from '../constants';
interface IEmail {
  email: string;
}

interface IUser {
  name: string;
  email: string;
  password: string;
}

interface IUserEdit {
  id: Types.ObjectId;
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
    const user = new User({ name, email, password });
    await user.newModel().save();
    return user;
  }

  public async listById({
    id,
  }: IId): Promise<
    FlattenMaps<IUser & { _id: Types.ObjectId }> | null | undefined
  > {
    const user = await User.getModel()
      .findOne({
        _id: id,
        removed: false,
      })
      .lean();

    return user;
  }

  public async edit({
    id,
    name,
    email,
  }: IUserEdit): Promise<UpdateWriteOpResult | null | undefined> {
    const updatedAt = new Date();
    const response = await User.getModel()
      .updateOne(
        {
          _id: id,
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
  }

  public async delete({
    id,
  }: IId): Promise<UpdateWriteOpResult | null | undefined> {
    const updatedAt = new Date();
    const response = await User.getModel()
      .updateOne(
        {
          _id: id,
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
  }
}

export default UsersRepository;
