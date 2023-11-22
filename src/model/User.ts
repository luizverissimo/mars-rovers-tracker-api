import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  removed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  removed: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
});

const userModel = model<IUser>('User', userSchema);

class User {
  name: string;

  email: string;

  password: string;

  constructor({ name, email, password }: IUser) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public static getModel() {
    return userModel;
  }
  public newModel() {
    return new userModel({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }
}
export default User;
