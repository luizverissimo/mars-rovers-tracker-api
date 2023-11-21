import mongoose, { Mongoose } from 'mongoose';
import AppError from '../errors/AppError';
const { MONGO_URI } = process.env;

class Database {
  private connection: Promise<Mongoose>;

  public async connect() {
    if (!MONGO_URI) {
      throw new AppError('You must have an URI to connect on database');
    }
    this.setConnection(await mongoose.connect(`${MONGO_URI}`));
  }

  public setConnection(connection: Promise<Mongoose>) {
    this.connection = connection;
  }

  public getConnection() {
    return this.connection;
  }
}

export default Database;
